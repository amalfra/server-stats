import alt from '../lib/alt';

class OverallMemoryUsage {
  constructor() {
    this.generateActions(
      'setOverallMemoryUsageData',
      'setUpdatedAgo',
      'setMemoryTotal',
      'setMemoryAvailable',
      'setMemoryUsed',
      'setMemoryFree',
      'setMemoryBuffcache',
      'setSwapTotal',
      'setSwapUsed',
      'setSwapFree',
      'setMemMemoryColour',
      'setSwapMemoryColour',
    );
  }
}

export default alt.createActions(OverallMemoryUsage);
