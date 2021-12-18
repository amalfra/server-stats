import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line as LineChart } from 'react-chartjs-2';
import { Label } from 'semantic-ui-react';

import CpuUsageSources from '../sources/CpuUsage';
import Utils from '../Utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};
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
  const [cpuUsageData, setCpuUsageData] = useState({
    labels: new Array(METRIC_MEMORY_LIMIT).fill(''),
    datasets: [],
  });

  useEffect(() => {
    const plotChart = (usages) => {
      for (let cpuNumber = 0; cpuNumber < usages.length; cpuNumber += 1) {
        // assign a colour to this cpu if its not yet done
        if (!cpuColours[cpuNumber]) {
          cpuColours[cpuNumber] = Utils.getRandomColour();
        }

        const datasetTemplate = {
          label: 'CPU',
          borderCapStyle: 'butt',
          borderColor: cpuColours[cpuNumber],
          data: [],
        };
        const previousDataset = cpuUsageData.datasets[cpuNumber];

        datasetTemplate.label += cpuNumber + 1;
        datasetTemplate.data = previousDataset ? previousDataset.data
          : new Array(METRIC_MEMORY_LIMIT).fill(0);
        datasetTemplate.data.push(usages[cpuNumber]);

        // the chart will show only the latest n metrics
        const start = datasetTemplate.data.length - METRIC_MEMORY_LIMIT;
        const end = datasetTemplate.data.length;
        datasetTemplate.data = datasetTemplate.data.splice(start, end);
        cpuUsageData.datasets[cpuNumber] = datasetTemplate;
      }

      setCpuUsageData(cpuUsageData);
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
          // eslint-disable-next-line no-console
          console.error(err);
          // don't fail, trigger next cycle, keep trying
          setTimeout(getCpuUsagePoller, 1500);
        });
    };

    const sinceTimeUpdater = () => {
      // calculate metric fetched ago to display as x axis labels
      for (let i = 0; i < metricFetchTimes.length; i += 1) {
        if (metricFetchTimes[i] !== 0) {
          cpuUsageData.labels[i] = `${Utils.findSecondsAgo(
            metricFetchTimes[i],
          )}s ago`;
        }
      }
      setCpuUsageData(cpuUsageData);

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
      <LineChart data={cpuUsageData} options={CHART_OPTIONS} />
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
