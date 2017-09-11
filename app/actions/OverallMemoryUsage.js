import alt from '../lib/alt'

class OverallMemoryUsage {
  constructor() {
    this.generateActions(
      'setOverallMemoryUsageData',
      'setUpdatedAgo'
    )
  }
}

export default alt.createActions(OverallMemoryUsage)
