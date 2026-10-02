import React, { useState, useEffect, useRef } from 'react';
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Divider, Grid, Group, Stack, Text, Title,
} from '@mantine/core';

import MemoryUsageComponent from './MemoryUsage';
import SwapUsageComponent from './SwapUsage';
import OverallMemoryUsageSources from '../sources/OverallMemoryUsage';
import Utils from '../Utils';

const METRIC_MEMORY_LIMIT = 5;

const memoryColours = {
  mem: Utils.getRandomColour(),
  swap: Utils.getRandomColour(),
};

const OverallMemoryUsage = function () {
  const [updatedAgo, setUpdatedAgo] = useState(0);
  const [overallMemoryUsageData, setOverallMemoryUsageData] = useState([]);
  const [memoryTotal, setMemoryTotal] = useState(0);
  const [memoryUsed, setMemoryUsed] = useState(0);
  const [swapTotal, setSwapTotal] = useState(0);
  const [swapUsed, setSwapUsed] = useState(0);
  const lastUpdated = useRef(null);

  useEffect(() => {
    const plotChart = (usages) => {
      setOverallMemoryUsageData((currentData) => [
        ...currentData.slice(-(METRIC_MEMORY_LIMIT - 1)),
        { fetchedAt: new Date(), ...usages },
      ]);
    };

    const getOverallMemoryUsagePoller = () => {
      OverallMemoryUsageSources.fetch()
        .then((usages) => {
          const newUsages = usages;
          lastUpdated.current = new Date();

          setMemoryTotal(newUsages.mem.total);
          setMemoryUsed(newUsages.mem.used);
          setSwapTotal(newUsages.swap.total);
          setSwapUsed(newUsages.swap.used);

          // start calculating usage for each memory type and put result in usages
          let usagePercentage = (1 - newUsages.mem.available / newUsages.mem.total) * 100;
          newUsages.mem = usagePercentage.toFixed(2);
          usagePercentage = newUsages.swap.free && newUsages.swap.total
            ? (1 - newUsages.swap.free / newUsages.swap.total) * 100 : 0;
          newUsages.swap = usagePercentage.toFixed(2);

          /*
            lets populate chart with all memory metrics:

            usages is an Object with key as memory type(mem, swap) and value being
            corresponding type's metric
            eg: {
              mem: 10.23 // metric of main memory
              swap: 0.23 // metric of swap memory
            }
          */
          plotChart(newUsages);

          // fetch usage for next cycle
          setTimeout(getOverallMemoryUsagePoller, 1500);
        }, (err) => {
          console.error(err);
          // don't fail, trigger next cycle, keep trying
          setTimeout(getOverallMemoryUsagePoller, 1500);
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
    getOverallMemoryUsagePoller();
    // keep time since updated
    sinceTimeUpdater();
  }, []);

  return (
    <article id="overall-memory-usage">
      <Grid gutter="xl" align="center">
        <Grid.Col span={{ base: 12, md: 9 }}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={overallMemoryUsageData.map(({ fetchedAt, ...usage }) => ({
                  ...usage,
                  time: `${Utils.findSecondsAgo(fetchedAt)}s ago`,
                }))}
              >
                <defs>
                  <linearGradient id="colourMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={memoryColours.mem} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={memoryColours.mem} stopOpacity={0.5} />
                  </linearGradient>
                  <linearGradient id="colourSwap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={memoryColours.swap} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={memoryColours.swap} stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <XAxis dataKey="time" />
                <YAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(tick) => `${tick} %`}
                />
                <Area
                  type="monotone"
                  dataKey="mem"
                  stroke={memoryColours.mem}
                  activeDot={{ r: 8 }}
                  fillOpacity={1}
                  fill="url(#colourMemory)"
                />
                <Area
                  type="monotone"
                  dataKey="swap"
                  stroke={memoryColours.swap}
                  activeDot={{ r: 8 }}
                  fillOpacity={1}
                  fill="url(#colourSwap)"
                />
              </AreaChart>
            </ResponsiveContainer>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Stack gap="md">
            <div>
              <Title order={4} mb="xs">Memory</Title>
              <MemoryUsageComponent
                memoryTotal={memoryTotal}
                memoryUsed={memoryUsed}
                memoryColour={memoryColours.mem}
              />
            </div>
            <Divider />
            <div>
              <Title order={4} mb="xs">Swap</Title>
              <SwapUsageComponent
                swapTotal={swapTotal}
                swapUsed={swapUsed}
                memoryColour={memoryColours.swap}
              />
            </div>
          </Stack>
        </Grid.Col>
      </Grid>
      <Group justify="flex-end" mt="sm">
        <Text size="sm" c="dimmed">
          Last updated: {updatedAgo ? `${updatedAgo} seconds ago` : 'not yet'}
        </Text>
      </Group>
    </article>
  );
};

export default OverallMemoryUsage;
