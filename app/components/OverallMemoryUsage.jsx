import React from 'react'
import { Line as LineChart, defaults } from 'react-chartjs-2'
import { Label } from 'semantic-ui-react'

import OverallMemoryUsageStore from '../stores/OverallMemoryUsage'
import OverallMemoryUsageActions from '../actions/OverallMemoryUsage'
import OverallMemoryUsageSources from '../sources/OverallMemoryUsage'

import Utils from '../Utils'

class OverallMemoryUsage extends React.Component {
  constructor() {
    super()

    this.state = OverallMemoryUsageStore.getState()
    this.onChange = this.onChange.bind(this)

    // disable chartjs animations
    defaults.global.animation = false

    this.lastUpdated = 0
    /*
      is an array which holds the time at which each metric was fetched
      eg: [<Date object>, <Date object>, <Date object>, <Date object>, <Date object>]
      initialize with zero 
    */
    this.metricFetchTimes = new Array(this.state.metricMemoryLimit).fill(0)
    this.memoryTypeLabels = {
      'mem': 'Memory',
      'swap': 'Swap'
    }

    OverallMemoryUsageActions.setMemMemoryColour(Utils.getRandomColour())
    OverallMemoryUsageActions.setSwapMemoryColour(Utils.getRandomColour())
  }

  componentDidMount() {
    OverallMemoryUsageStore.listen(this.onChange)
    // start the poller which will fetch metrics 
    this.getOverallMemoryUsagePoller()
    // keep time since updated
    this.sinceTimeUpdater()
  }

  componentWillUnmount() {
    OverallMemoryUsageStore.unlisten(this.onChange)
  }

  onChange(state) {
    this.setState(state)
  }

  sinceTimeUpdater() {
    // calculate metric fetched ago to display as x axis labels
    for (let i = 0; i < this.metricFetchTimes.length; i++) {
      if (this.metricFetchTimes[i] !== 0) {
        this.state.overallMemoryUsageData.labels[i] = Utils.findSecondsAgo(
          this.metricFetchTimes[i]) + 's ago'
      }
    }
    OverallMemoryUsageActions.setOverallMemoryUsageData(
      this.state.overallMemoryUsageData)

    // calcuate updated since if we had a previous update
    if (this.lastUpdated) {
      OverallMemoryUsageActions.setUpdatedAgo(Utils.findSecondsAgo(
        this.lastUpdated))
    }

    setTimeout(() => {
      this.sinceTimeUpdater()
    }, 1000)
  }

  getOverallMemoryUsagePoller() {
    OverallMemoryUsageSources.fetch().then((usages) => {
      this.lastUpdated = new Date()
      this.metricFetchTimes.push(this.lastUpdated)
      // the chart will show only the latest n metrics, hence there should only be n labels
      let start = this.metricFetchTimes.length - this.state.metricMemoryLimit
      let end = this.metricFetchTimes.length
      this.metricFetchTimes = this.metricFetchTimes.splice(start, end)

      OverallMemoryUsageActions.setMemoryTotal(usages.mem.total)
      OverallMemoryUsageActions.setMemoryAvailable(usages.mem.available)
      OverallMemoryUsageActions.setMemoryUsed(usages.mem.used)
      OverallMemoryUsageActions.setMemoryFree(usages.mem.free)
      OverallMemoryUsageActions.setMemoryBuffcache(usages.mem.buffcache)
      OverallMemoryUsageActions.setSwapTotal(usages.swap.total)
      OverallMemoryUsageActions.setSwapUsed(usages.swap.used)
      OverallMemoryUsageActions.setSwapFree(usages.swap.free)

      // start calculating usage for each memory type and put result in usages
      let usage_percentage = (1 - usages.mem.available/usages.mem.total) * 100
      usages.mem = usage_percentage.toFixed(2)
      usage_percentage = usages.swap.free && usages.swap.total ? 
        (1 - usages.swap.free/usages.swap.total) * 100 : 0
      usages.swap = usage_percentage.toFixed(2)

      /*
        lets populate chart with all memory metrics:

        usages is an Object with key as memory type(mem, swap) and value being 
        corresponding type's metric
        eg: {
          mem: 10.23 // metric of main memory
          swap: 0.23 // metric of swap memory
        }
      */
      this.plotChart(usages)

      // fetch usage for next cycle
      this.triggerNextCycle()
    }, (err) => {
      // don't fail, trigger next cycle, keep trying
      this.triggerNextCycle()
    })
  }

  triggerNextCycle() {
    setTimeout(() => {
      this.getOverallMemoryUsagePoller()
    }, 1500)
  }

  plotChart(usages) {
    let i = 0;
    for (let memType in usages) {
      let datasetTemplate = {
        label: this.memoryTypeLabels[memType],
        fill: false,
        showLine: true,
        lineTension: 0.1,
        borderCapStyle: 'butt',
        borderColor: this.state.memoryColours[memType],
        data: []
      }
      let previousDataset = this.state.overallMemoryUsageData.datasets[i]    

      datasetTemplate.data = previousDataset ? previousDataset.data :
        new Array(this.state.metricMemoryLimit).fill(0)
      datasetTemplate.data.push(usages[memType])

      // the chart will show only the latest n metrics
      let start = datasetTemplate.data.length - this.state.metricMemoryLimit
      let end = datasetTemplate.data.length
      datasetTemplate.data = datasetTemplate.data.splice(start, end)
      this.state.overallMemoryUsageData.datasets[i] = datasetTemplate
      i++
    }

    OverallMemoryUsageActions.setOverallMemoryUsageData(
      this.state.overallMemoryUsageData)
  }

  render() {
    let chartOptions = {
      scales: { 
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            stepSize: 20,
            callback: (value) => { return value + '%' }
          }
        }]
      },
      legend: {
        position: 'bottom'
      }
    }

    return(
      <article id='overall-memory-usage'>
        <LineChart data={this.state.overallMemoryUsageData}
          options={chartOptions} />
        <br />
        <Label className='pull-right'>
          Last updated: { this.state.updatedAgo ?
            this.state.updatedAgo + ' seconds ago' : 'not yet'
          }
        </Label>
        <br className='clearfix' />
      </article>
    )
  }
}

export default OverallMemoryUsage
