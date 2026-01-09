import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Label, Grid, Header, Divider,
} from 'semantic-ui-react';

import MemoryUsageComponent from './MemoryUsage';
import SwapUsageComponent from './SwapUsage';
import OverallMemoryUsageSources from '../sources/OverallMemoryUsage';
import Utils from '../Utils';

const METRIC_MEMORY_LIMIT = 5;

let lastUpdated = 0;
/*
  is an array which holds the time at which each metric was fetched
  eg: [<Date object>, <Date object>, <Date object>, <Date object>, <Date object>]
  initialize with zero
*/
let metricFetchTimes = new Array(METRIC_MEMORY_LIMIT).fill(0);
const memoryColours = {
  mem: Utils.getRandomColour(),
  swap: Utils.getRandomColour(),
};

const OverallMemoryUsage = function () {
  const [updatedAgo, setUpdatedAgo] = useState(0);
  const [overallMemoryUsageData, setOverallMemoryUsageData] = useState(new Array(METRIC_MEMORY_LIMIT).fill({}));
  const [memoryTotal, setMemoryTotal] = useState(0);
  const [memoryUsed, setMemoryUsed] = useState(0);
  const [swapTotal, setSwapTotal] = useState(0);
  const [swapUsed, setSwapUsed] = useState(0);

  useEffect(() => {
    const plotChart = (usages) => {
      let newOverallMemoryUsageData = overallMemoryUsageData;

      // calculate metric fetched ago to display as x axis labels
      for (let i = 0; i < metricFetchTimes.length; i += 1) {
        const datasetTemplate = {
          time: '0s ago',
        };

        Object.keys(usages).forEach((memType) => {
          datasetTemplate[memType] = usages[memType];
        });

        // calculate metric fetched ago to display as x axis labels
        if (metricFetchTimes[i] !== 0) {
          datasetTemplate.time = `${Utils.findSecondsAgo(metricFetchTimes[i])}s ago`;
        }

        newOverallMemoryUsageData.push(datasetTemplate);
      }

      // the chart will show only the latest n metrics
      const start = newOverallMemoryUsageData.length - METRIC_MEMORY_LIMIT;
      const end = newOverallMemoryUsageData.length;
      newOverallMemoryUsageData = newOverallMemoryUsageData.splice(start, end);

      setOverallMemoryUsageData(newOverallMemoryUsageData);
    };

    const getOverallMemoryUsagePoller = () => {
      OverallMemoryUsageSources.fetch()
        .then((usages) => {
          const newUsages = usages;
          lastUpdated = new Date();
          metricFetchTimes.push(lastUpdated);
          // the chart will show only the latest n metrics, hence there should only be n labels
          const start = metricFetchTimes.length - METRIC_MEMORY_LIMIT;
          const end = metricFetchTimes.length;
          metricFetchTimes = metricFetchTimes.splice(start, end);

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
      if (lastUpdated) {
        setUpdatedAgo(Utils.findSecondsAgo(lastUpdated));
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
      <Grid container>
        <Grid.Row>
          <Grid.Column width={12}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={overallMemoryUsageData}>
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
          </Grid.Column>
          <Grid.Column width={4}>
            <Grid.Row>
              <Grid.Column>
                <Header as="h4">
                  Memory
                </Header>
                <MemoryUsageComponent
                  memoryTotal={memoryTotal}
                  memoryUsed={memoryUsed}
                  memoryColour={memoryColours.mem}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <br />
                <br />
                <Divider />
                <br />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as="h4">
                  Swap
                </Header>
                <SwapUsageComponent swapTotal={swapTotal} swapUsed={swapUsed} memoryColour={memoryColours.swap} />
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Label className="pull-right">
        Last updated:
        {' '}
        {updatedAgo ? `${updatedAgo} seconds ago` : 'not yet'}
      </Label>
      <br className="clearfix" />
    </article>
  );
};

export default OverallMemoryUsage;
