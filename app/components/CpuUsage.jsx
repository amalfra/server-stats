import React, { useEffect, useRef, useState } from 'react';
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Group, Text } from '@mantine/core';

import CpuUsageSources from '../sources/CpuUsage';
import Utils from '../Utils';

const METRIC_MEMORY_LIMIT = 5;

const cpuColours = [];

const CpuUsage = function () {
  const [updatedAgo, setUpdatedAgo] = useState(0);
  const [cpuUsageData, setCpuUsageData] = useState([]);
  const previousCpuUsageTotal = useRef([]);
  const previousCpuUsageIdle = useRef([]);
  const lastUpdated = useRef(null);

  useEffect(() => {
    const plotChart = (usages) => {
      const datasetTemplate = { fetchedAt: new Date() };

      for (let cpuNumber = 0; cpuNumber < usages.length; cpuNumber += 1) {
        // assign a colour to this cpu if its not yet done
        if (!cpuColours[cpuNumber]) {
          cpuColours[cpuNumber] = Utils.getRandomColour();
        }

        datasetTemplate[`cpu${cpuNumber + 1}`] = usages[cpuNumber];
      }

      setCpuUsageData((currentData) => [
        ...currentData.slice(-(METRIC_MEMORY_LIMIT - 1)),
        datasetTemplate,
      ]);
    };

    const getCpuUsagePoller = () => {
      CpuUsageSources.fetch()
        .then((usages) => {
          const newUsages = usages;
          lastUpdated.current = new Date();

          // start calculating usage for each cpu and put result in usages
          for (let i = 0; i < newUsages.length; i += 1) {
            let usageMetrics = newUsages[i].split(' ');
            // lets first convert all the data to int
            usageMetrics = usageMetrics.map((x) => parseInt(x, 10));
            const totalTime = usageMetrics[1] + usageMetrics[2] + usageMetrics[3]
              + usageMetrics[4] + usageMetrics[5] + usageMetrics[6]
              + usageMetrics[7] + usageMetrics[8];
            const idleTime = usageMetrics[4] + usageMetrics[5];
            // calculate the diff usage since we last checked
            const diffIdleTime = idleTime
              - (previousCpuUsageIdle.current[i] || 0);
            const diffTotalTime = totalTime
              - (previousCpuUsageTotal.current[i] || 0);
            const diffUsageTime = diffTotalTime - diffIdleTime;
            const diffUsagePercentage = (diffUsageTime / diffTotalTime) * 100;
            newUsages[i] = diffUsagePercentage.toFixed(2);
            // present will be the past in future :-P
            previousCpuUsageTotal.current[i] = totalTime;
            previousCpuUsageIdle.current[i] = idleTime;
          }

          /*
            lets populate chart with all cpus metrics:

            usages is an Array with key as cpu number and value being
            corresponding cpu's metric
            eg: {
              0: 10.23 // metric of first cpu
              1: 0.23 // metric of second cpu
            }
          */
          plotChart(newUsages);

          // fetch usage for next cycle
          setTimeout(getCpuUsagePoller, 1500);
        }, (err) => {
          console.error(err);
          // don't fail, trigger next cycle, keep trying
          setTimeout(getCpuUsagePoller, 1500);
        });
    };

    const sinceTimeUpdater = () => {
      // calcuate updated since if we had a previous update
      if (lastUpdated.current) {
        setUpdatedAgo(Utils.findSecondsAgo(lastUpdated.current));
      }

      setTimeout(sinceTimeUpdater, 1000);
    };

    // start the poller which will fetch metrics
    getCpuUsagePoller();
    // keep time since updated
    sinceTimeUpdater();
  }, []);

  return (
    <article id="cpu-usage">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={cpuUsageData.map(({ fetchedAt, ...usage }) => ({
            ...usage,
            time: `${Utils.findSecondsAgo(fetchedAt)}s ago`,
          }))}
        >
          <defs>
            {cpuColours.map((cpuColour, index) => (
              <linearGradient key={`cpu${index + 1}`} id={`color${`Cpu${index + 1}`}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cpuColour} stopOpacity={0.8} />
                <stop offset="95%" stopColor={cpuColour} stopOpacity={0.5} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <XAxis dataKey="time" />
          <YAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(tick) => `${tick} %`}
          />
          {cpuColours.map((cpuColour, index) => (
            <Area
              key={`cpu${index + 1}`}
              type="monotone"
              dataKey={`cpu${index + 1}`}
              stroke={cpuColour}
              activeDot={{ r: 8 }}
              fillOpacity={1}
              fill={`url(#${`color${`Cpu${index + 1}`}`})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <br />
      <Group justify="flex-end" mt="sm">
        <Text size="sm" c="dimmed">
          Last updated: {updatedAgo ? `${updatedAgo} seconds ago` : 'not yet'}
        </Text>
      </Group>
    </article>
  );
};

export default CpuUsage;
