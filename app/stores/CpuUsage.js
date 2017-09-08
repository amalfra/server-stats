import alt from '../lib/alt'

import CpuUsageActions from '../actions/CpuUsage'

class CpuUsage {
  constructor() {
    this.bindActions(CpuUsageActions)

    this.metricMemoryLimit = 5
    this.cpuUsageData = {
      labels: new Array(this.metricMemoryLimit).fill(''),
      datasets: []
    }
  }

  onSetCpuUsageData(cpuUsage) {
    this.cpuUsageData = cpuUsage
  }
}

export default alt.createStore(CpuUsage, 'CpuUsage')
