import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer,
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
const memoryTypeLabels = {
  mem: 'Memory',
  swap: 'Swap',
};
const memoryColours = {
  mem: Utils.getRandomColour(),
  swap: Utils.getRandomColour(),
};

const OverallMemoryUsage = function () {
  const [updatedAgo, setUpdatedAgo] = useState(0);
  const [overallMemoryUsageData, setOverallMemoryUsageData] = useState({
    labels: new Array(METRIC_MEMORY_LIMIT).fill(''),
    datasets: [],
  });
  const [memoryTotal, setMemoryTotal] = useState(0);
  const [memoryUsed, setMemoryUsed] = useState(0);
  const [swapTotal, setSwapTotal] = useState(0);
  const [swapUsed, setSwapUsed] = useState(0);

  useEffect(() => {
    const plotChart = (usages) => {
      let i = 0;

      Object.keys(usages).forEach((memType) => {
        const datasetTemplate = {
          label: memoryTypeLabels[memType],
          borderCapStyle: 'butt',
          borderColor: memoryColours[memType],
          data: [],
        };
        const previousDataset = overallMemoryUsageData.datasets[i];

        datasetTemplate.data = previousDataset ? previousDataset.data
          : new Array(METRIC_MEMORY_LIMIT).fill(0);
        datasetTemplate.data.push(usages[memType]);

        // the chart will show only the latest n metrics
        const start = datasetTemplate.data.length - METRIC_MEMORY_LIMIT;
        const end = datasetTemplate.data.length;
        datasetTemplate.data = datasetTemplate.data.splice(start, end);
        overallMemoryUsageData.datasets[i] = datasetTemplate;
        i += 1;
      });

      setOverallMemoryUsageData(overallMemoryUsageData);
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
          // eslint-disable-next-line no-console
          console.error(err);
          // don't fail, trigger next cycle, keep trying
          setTimeout(getOverallMemoryUsagePoller, 1500);
        });
    };

    const sinceTimeUpdater = () => {
      // calculate metric fetched ago to display as x axis labels
      for (let i = 0; i < metricFetchTimes.length; i += 1) {
        if (metricFetchTimes[i] !== 0) {
          overallMemoryUsageData.labels[i] = `${Utils.findSecondsAgo(
            metricFetchTimes[i],
          )}s ago`;
        }
      }
      setOverallMemoryUsageData(overallMemoryUsageData);

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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(tick) => `${tick} %`}
                />
                <Area
                  type="monotone"
                  dataKey="data"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
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
