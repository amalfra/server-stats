import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Label } from 'semantic-ui-react';

import CpuUsageSources from '../sources/CpuUsage';
import Utils from '../Utils';

const METRIC_MEMORY_LIMIT = 5;

// will hold values calculated in last cycle to find diff aganist
const previousCpuUsageTotal = [];
const previousCpuUsageIdle = [];
let lastUpdated = 0;
/*
  is an array which holds the time at which each metric was fetched
  eg: [<Date object>, <Date object>, <Date object>, <Date object>, <Date object>]
  initialize with zero
*/
let metricFetchTimes = new Array(METRIC_MEMORY_LIMIT).fill(0);
const cpuColours = [];

const CpuUsage = function () {
  const [updatedAgo, setUpdatedAgo] = useState(0);
  const [cpuUsageData, setCpuUsageData] = useState(new Array(METRIC_MEMORY_LIMIT).fill({}));

  useEffect(() => {
    const plotChart = (usages) => {
      let newCpuUsageData = cpuUsageData;

      // calculate metric fetched ago to display as x axis labels
      for (let i = 0; i < metricFetchTimes.length; i += 1) {
        const datasetTemplate = {
          time: '0s ago',
        };

        for (let cpuNumber = 0; cpuNumber < usages.length; cpuNumber += 1) {
          // assign a colour to this cpu if its not yet done
          if (!cpuColours[cpuNumber]) {
            cpuColours[cpuNumber] = Utils.getRandomColour();
          }

          datasetTemplate[`cpu${cpuNumber + 1}`] = 0;
          if (metricFetchTimes[i] !== 0) {
            datasetTemplate.time = `${Utils.findSecondsAgo(metricFetchTimes[i])}s ago`;
            datasetTemplate[`cpu${cpuNumber + 1}`] = usages[cpuNumber];
          }
        }
        newCpuUsageData.push(datasetTemplate);
      }

      // the chart will show only the latest n metrics
      const start = newCpuUsageData.length - METRIC_MEMORY_LIMIT;
      const end = newCpuUsageData.length;
      newCpuUsageData = newCpuUsageData.splice(start, end);

      setCpuUsageData(newCpuUsageData);
    };

    const getCpuUsagePoller = () => {
      CpuUsageSources.fetch()
        .then((usages) => {
          const newUsages = usages;
          lastUpdated = new Date();
          metricFetchTimes.push(lastUpdated);
          // the chart will show only the latest n metrics, hence there should only be n labels
          const start = metricFetchTimes.length - METRIC_MEMORY_LIMIT;
          const end = metricFetchTimes.length;
          metricFetchTimes = metricFetchTimes.splice(start, end);

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
              - (previousCpuUsageIdle[i] || 0);
            const diffTotalTime = totalTime
              - (previousCpuUsageTotal[i] || 0);
            const diffUsageTime = diffTotalTime - diffIdleTime;
            const diffUsagePercentage = (diffUsageTime / diffTotalTime) * 100;
            newUsages[i] = diffUsagePercentage.toFixed(2);
            // present will be the past in future :-P
            previousCpuUsageTotal[i] = totalTime;
            previousCpuUsageIdle[i] = idleTime;
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
      if (lastUpdated) {
        setUpdatedAgo(Utils.findSecondsAgo(lastUpdated));
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
        <AreaChart data={cpuUsageData}>
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
      <Label className="pull-right">
        Last updated:
        {' '}
        {updatedAgo ? `${updatedAgo} seconds ago` : 'not yet'}
      </Label>
      <br className="clearfix" />
    </article>
  );
};

export default CpuUsage;
