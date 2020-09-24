import React from 'react';
import { Line as LineChart, defaults } from 'react-chartjs-2';
import {
  Label, Grid, Header, Divider,
} from 'semantic-ui-react';

import MemoryUsageComponent from './MemoryUsage';
import SwapUsageComponent from './SwapUsage';
import OverallMemoryUsageStore from '../stores/OverallMemoryUsage';
import OverallMemoryUsageActions from '../actions/OverallMemoryUsage';
import OverallMemoryUsageSources from '../sources/OverallMemoryUsage';
import Utils from '../Utils';

class OverallMemoryUsage extends React.Component {
  constructor() {
    super();

    this.state = OverallMemoryUsageStore.getState();
    this.onChange = this.onChange.bind(this);

    // disable chartjs animations
    defaults.global.animation = false;

    this.lastUpdated = 0;
    /*
      is an array which holds the time at which each metric was fetched
      eg: [<Date object>, <Date object>, <Date object>, <Date object>, <Date object>]
      initialize with zero
    */
    const { metricMemoryLimit } = this.state;
    this.metricFetchTimes = new Array(metricMemoryLimit).fill(0);
    this.memoryTypeLabels = {
      mem: 'Memory',
      swap: 'Swap',
    };

    OverallMemoryUsageActions.setMemMemoryColour(Utils.getRandomColour());
    OverallMemoryUsageActions.setSwapMemoryColour(Utils.getRandomColour());
  }

  componentDidMount() {
    OverallMemoryUsageStore.listen(this.onChange);
    // start the poller which will fetch metrics
    this.getOverallMemoryUsagePoller();
    // keep time since updated
    this.sinceTimeUpdater();
  }

  componentWillUnmount() {
    OverallMemoryUsageStore.unlisten(this.onChange);
  }

  onChange = (state) => {
    this.setState(state);
  };

  getOverallMemoryUsagePoller = () => {
    OverallMemoryUsageSources.fetch()
      .then((usages) => {
        const { metricMemoryLimit } = this.state;
        const newUsages = usages;
        this.lastUpdated = new Date();
        this.metricFetchTimes.push(this.lastUpdated);
        // the chart will show only the latest n metrics, hence there should only be n labels
        const start = this.metricFetchTimes.length - metricMemoryLimit;
        const end = this.metricFetchTimes.length;
        this.metricFetchTimes = this.metricFetchTimes.splice(start, end);

        OverallMemoryUsageActions.setMemoryTotal(newUsages.mem.total);
        OverallMemoryUsageActions.setMemoryAvailable(newUsages.mem.available);
        OverallMemoryUsageActions.setMemoryUsed(newUsages.mem.used);
        OverallMemoryUsageActions.setMemoryFree(newUsages.mem.free);
        OverallMemoryUsageActions.setMemoryBuffcache(newUsages.mem.buffcache);
        OverallMemoryUsageActions.setSwapTotal(newUsages.swap.total);
        OverallMemoryUsageActions.setSwapUsed(newUsages.swap.used);
        OverallMemoryUsageActions.setSwapFree(newUsages.swap.free);

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
        this.plotChart(newUsages);

        // fetch usage for next cycle
        this.triggerNextCycle();
      }, (err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        // don't fail, trigger next cycle, keep trying
        this.triggerNextCycle();
      });
  };

  sinceTimeUpdater = () => {
    const { overallMemoryUsageData } = this.state;

    // calculate metric fetched ago to display as x axis labels
    for (let i = 0; i < this.metricFetchTimes.length; i += 1) {
      if (this.metricFetchTimes[i] !== 0) {
        overallMemoryUsageData.labels[i] = `${Utils.findSecondsAgo(
          this.metricFetchTimes[i],
        )}s ago`;
      }
    }
    OverallMemoryUsageActions.setOverallMemoryUsageData(overallMemoryUsageData);

    // calcuate updated since if we had a previous update
    if (this.lastUpdated) {
      OverallMemoryUsageActions.setUpdatedAgo(Utils.findSecondsAgo(
        this.lastUpdated,
      ));
    }

    setTimeout(this.sinceTimeUpdater, 1000);
  };

  triggerNextCycle = () => {
    setTimeout(this.getOverallMemoryUsagePoller, 1500);
  };

  plotChart = (usages) => {
    const { memoryColours, overallMemoryUsageData, metricMemoryLimit } = this.state;
    let i = 0;

    Object.keys(usages).forEach((memType) => {
      const datasetTemplate = {
        label: this.memoryTypeLabels[memType],
        fill: false,
        showLine: true,
        lineTension: 0.1,
        borderCapStyle: 'butt',
        borderColor: memoryColours[memType],
        data: [],
      };
      const previousDataset = overallMemoryUsageData.datasets[i];

      datasetTemplate.data = previousDataset ? previousDataset.data
        : new Array(metricMemoryLimit).fill(0);
      datasetTemplate.data.push(usages[memType]);

      // the chart will show only the latest n metrics
      const start = datasetTemplate.data.length - metricMemoryLimit;
      const end = datasetTemplate.data.length;
      datasetTemplate.data = datasetTemplate.data.splice(start, end);
      overallMemoryUsageData.datasets[i] = datasetTemplate;
      i += 1;
    });

    OverallMemoryUsageActions.setOverallMemoryUsageData(overallMemoryUsageData);
  };

  render() {
    const { overallMemoryUsageData, updatedAgo } = this.state;
    const chartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            stepSize: 20,
            callback: (value) => `${value}%`,
          },
        }],
      },
      legend: {
        position: 'bottom',
      },
    };

    return (
      <article id="overall-memory-usage">
        <Grid container>
          <Grid.Row>
            <Grid.Column width={12}>
              <LineChart
                data={overallMemoryUsageData}
                options={chartOptions}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h4">
                    Memory
                  </Header>
                  <MemoryUsageComponent />
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
                  <SwapUsageComponent />
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
  }
}

export default OverallMemoryUsage;
