import React from 'react'
import { Line as LineChart, defaults } from 'react-chartjs-2'
import { Label } from 'semantic-ui-react'

import AppStore from '../stores/App'
import OverallMemoryUsageStore from '../stores/OverallMemoryUsage'
import OverallMemoryUsageActions from '../actions/OverallMemoryUsage'

import Utils from '../Utils'

class OverallMemoryUsage extends React.Component {
  constructor() {
    super()

    this.appState = AppStore.getState()
    this.state = OverallMemoryUsageStore.getState()
    this.onChange = this.onChange.bind(this)

    // disable chartjs animations
    defaults.global.animation = false

    this.lastUpdated = 0
    this.updatedAgo = 0
    /*
      is an array which holds the time at which each metric was fetched
      eg: [<Date object>, <Date object>, <Date object>, <Date object>, <Date object>]
      initialize with zero 
    */
    this.metricFetchTimes = new Array(this.state.metricMemoryLimit).fill(0)
    this.memoryColours = {
      'mem': Utils.getRandomColor(),
      'swap': Utils.getRandomColor()
    }
  }

  componentDidMount() {
    OverallMemoryUsageStore.listen(this.onChange)
  }

  componentWillUnmount() {
    OverallMemoryUsageStore.unlisten(this.onChange)
  }

  onChange(state) {
    this.setState(state)
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
          Last updated: { this.updatedAgo ?
            this.updatedAgo + ' seconds ago' : 'not yet'
          }
        </Label>
        <br className='clearfix' />
      </article>
    )
  }
}

export default OverallMemoryUsage
