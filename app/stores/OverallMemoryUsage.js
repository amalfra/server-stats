import alt from '../lib/alt'

import OverallMemoryUsageActions from '../actions/OverallMemoryUsage'

class OverallMemoryUsage {
  constructor() {
    this.bindActions(OverallMemoryUsageActions)

    this.metricMemoryLimit = 5
    this.overallMemoryUsageData = {
      labels: new Array(this.metricMemoryLimit).fill(''),
      datasets: []
    }
  }

  onSetOverallMemoryUsageData(overallMemoryUsage) {
    this.overallMemoryUsageData = overallMemoryUsage
  }
}

export default alt.createStore(OverallMemoryUsage, 'OverallMemoryUsage')
