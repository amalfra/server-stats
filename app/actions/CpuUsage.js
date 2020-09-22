import alt from '../lib/alt';

class CpuUsage {
  constructor() {
    this.generateActions(
      'setCpuUsageData',
      'setUpdatedAgo',
    );
  }
}

export default alt.createActions(CpuUsage);
