import React from 'react'
import { Line as LineChart, defaults } from 'react-chartjs-2'
import { Label } from 'semantic-ui-react'

import AppStore from '../stores/App'
import CpuUsageStore from '../stores/CpuUsage'
import CpuUsageActions from '../actions/CpuUsage'

import Utils from '../Utils'

class CpuUsage extends React.Component {
  constructor() {
    super()
    
    this.appState = AppStore.getState()
    this.state = CpuUsageStore.getState()
    this.onChange = this.onChange.bind(this)

    // disable chartjs animations
    defaults.global.animation = false

    // will hold values calculated in last cycle to find diff aganist
    this.previousCpuUsageTotal = []
    this.previousCpuUsageIdle = []
    this.lastUpdated = 0
    this.updatedAgo = 0
    /*
      is an array which holds the time at which each metric was fetched
      eg: [<Date object>, <Date object>, <Date object>, <Date object>, <Date object>]
      initialize with zero 
    */
    this.metricFetchTimes = new Array(this.state.metricMemoryLimit).fill(0)
    this.cpuColours = []
  }

  componentDidMount() {
    CpuUsageStore.listen(this.onChange)
    // start the poller which will fetch metrics 
    this.getCpuUsagePoller()
    // keep time since updated
    this.sinceTimeUpdater()
  }

  componentWillUnmount() {
    CpuUsageStore.unlisten(this.onChange)
  }

  onChange(state) {
    this.setState(state)
  }

  sinceTimeUpdater() {
    // calculate metric fetched ago to display as x axis labels
    for (let i = 0; i < this.metricFetchTimes.length; i++) {
      if (this.metricFetchTimes[i] !== 0) {
        this.state.cpuUsageData.labels[i] = Utils.findSecondsAgo(
          this.metricFetchTimes[i]) + 's ago'
      }
    }
    CpuUsageActions.setCpuUsageData(this.state.cpuUsageData)

    // calcuate updated since if we have a previous update
    if (this.lastUpdated) {
      this.updatedAgo = Utils.findSecondsAgo(this.lastUpdated)
    }

    setTimeout(() => {
      this.sinceTimeUpdater()
    }, 1000)
  }

  getCpuUsagePoller() {
    this.getCpuUsage().then((usages) => {
      this.lastUpdated = new Date()
      this.metricFetchTimes.push(this.lastUpdated)
      // the chart will show only the latest n metrics, hence there should only be n labels
      let start = this.metricFetchTimes.length - this.state.metricMemoryLimit
      let end = this.metricFetchTimes.length
      this.metricFetchTimes = this.metricFetchTimes.splice(start, end)

      /*
        lets populate chart with all cpus metrics:

        usages is an Array with key as cpu number and value being 
        corresponding cpu's metric
        eg: {
          0: 10.23 // metric of first cpu
          1: 0.23 // metric of second cpu
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
      this.getCpuUsagePoller()
    }, 1500)
  }

  plotChart(usages) {
    for (let cpuNumber = 0; cpuNumber < usages.length; cpuNumber++) {
      // assign a colour to this cpu if its not yet done
      if (!this.cpuColours[cpuNumber]) {
        this.cpuColours[cpuNumber] = Utils.getRandomColor()
      }

      let datasetTemplate = {
        label: 'CPU',
        fill: false,
        showLine: true,
        lineTension: 0.1,
        borderCapStyle: 'butt',
        borderColor: this.cpuColours[cpuNumber],
        data: []
      }
      let previousDataset = this.state.cpuUsageData.datasets[cpuNumber]

      datasetTemplate.label += cpuNumber + 1
      datasetTemplate.data = previousDataset ? previousDataset.data :
        new Array(this.state.metricMemoryLimit).fill(0)
      datasetTemplate.data.push(usages[cpuNumber])

      // the chart will show only the latest n metrics
      let start = datasetTemplate.data.length - this.state.metricMemoryLimit
      let end = datasetTemplate.data.length
      datasetTemplate.data = datasetTemplate.data.splice(start, end)
      this.state.cpuUsageData.datasets[cpuNumber] = datasetTemplate
    }

    CpuUsageActions.setCpuUsageData(this.state.cpuUsageData)
  }

  getCpuUsage() {
    return new Promise((resolve, reject) => {
      /*
          /proc/stat cpu metric format
        --------------------------------
             user nice system idle iowait  irq  softirq steal guest guest_nice
        cpu  4705 356  584    3699   23    23     0       0     0          0

        user: normal processes executing in user mode
        nice: niced processes executing in user mode
        system: processes executing in kernel mode
        idle: twiddling thumbs
        iowait: waiting for I/O to complete
        irq: servicing interrupts
        softirq: servicing softirqs
        steal: involuntary wait
        guest: running a normal guest
        guest_nice: running a niced guest

        Total CPU time since boot = user+nice+system+idle+iowait+irq+softirq+steal
        Total CPU Idle time since boot = idle + iowait
        Total CPU usage time since boot = Total CPU time since boot - Total CPU Idle time since boot
        Total CPU percentage = (Total CPU usage time since boot/Total CPU time since boot) * 100
      */
      this.appState.serverConnection.exec('cat /proc/stat | grep "^cpu" | ' +
        'sed "s/cpu//g"')
        .then((cmdStdout) => {
          let formattedOutput = []
          let cpuUsages = cmdStdout.split('\n')
          // first line combined metrics of all cpus which we are not interested in
          cpuUsages.shift()
          // start calculating usage for each cpu and put result in formattedOutput
          for (let i = 0; i < cpuUsages.length; i++) {
            let usageMetrics = cpuUsages[i].split(' ')
            // lets first convert all the data to int
            usageMetrics = usageMetrics.map((x) => {
              return parseInt(x, 10)
            })
            let total_time = usageMetrics[1] + usageMetrics[2] + usageMetrics[3]
              + usageMetrics[4] + usageMetrics[5] + usageMetrics[6]
              + usageMetrics[7] + usageMetrics[8]
            let idle_time = usageMetrics[4] + usageMetrics[5]
            // calculate the diff usage since we last checked
            let diff_idle_time = idle_time -
              (this.previousCpuUsageIdle[i] || 0)
            let diff_total_time = total_time -
              (this.previousCpuUsageTotal[i] || 0)
            let diff_usage_time = diff_total_time - diff_idle_time
            let diff_usage_percentage = (diff_usage_time/diff_total_time) * 100
            formattedOutput[i] = diff_usage_percentage.toFixed(2)
            // present will be the past in future :-P 
            this.previousCpuUsageTotal[i] = total_time
            this.previousCpuUsageIdle[i] = idle_time
          }
          return resolve(formattedOutput)
        }, (cmdStderr, code) => {
          return reject(cmdStderr)
        })
    })
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
      <article id='cpu-usage'>
        <LineChart data={this.state.cpuUsageData} options={chartOptions} />
        <br />
        <Label className='pull-right'>
          Last updated: { this.updatedAgo ?
            this.updatedAgo + ' seconds ago' : 'not yet'
          }
        </Label>
        <br className='clearfix' />
      </article>
    )
  }
}

export default CpuUsage
