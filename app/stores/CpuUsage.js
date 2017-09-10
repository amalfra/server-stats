import alt from '../lib/alt'

import CpuUsageActions from '../actions/CpuUsage'

class CpuUsage {
  constructor() {
    this.bindActions(CpuUsageActions)

    this.metricMemoryLimit = 5
    this.updatedAgo = 0
    this.cpuUsageData = {
      labels: new Array(this.metricMemoryLimit).fill(''),
      datasets: []
    }
  }

  onSetCpuUsageData(cpuUsage) {
    this.cpuUsageData = cpuUsage
  }

  onSetUpdatedAgo(updatedAgo) {
    this.updatedAgo = updatedAgo
  }
}

export default alt.createStore(CpuUsage, 'CpuUsage')
