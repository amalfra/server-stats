import alt from '../lib/alt';

import OverallMemoryUsageActions from '../actions/OverallMemoryUsage';

class OverallMemoryUsage {
  constructor() {
    this.bindActions(OverallMemoryUsageActions);

    this.metricMemoryLimit = 5;
    this.updatedAgo = 0;
    this.overallMemoryUsageData = {
      labels: new Array(this.metricMemoryLimit).fill(''),
      datasets: [],
    };
    this.memoryTotal = 0;
    this.memoryAvailable = 0;
    this.memoryUsed = 0;
    this.memoryFree = 0;
    this.memoryBuffcache = 0;
    this.swapTotal = 0;
    this.swapUsed = 0;
    this.swapFree = 0;
    this.memoryColours = {
      mem: '',
      swap: '',
    };
  }

  onSetOverallMemoryUsageData(overallMemoryUsage) {
    this.overallMemoryUsageData = overallMemoryUsage;
  }

  onSetUpdatedAgo(updatedAgo) {
    this.updatedAgo = updatedAgo;
  }

  onSetMemoryTotal(memoryTotal) {
    this.memoryTotal = memoryTotal;
  }

  onSetMemoryAvailable(memoryAvailable) {
    this.memoryAvailable = memoryAvailable;
  }

  onSetMemoryUsed(memoryUsed) {
    this.memoryUsed = memoryUsed;
  }

  onSetMemoryFree(memoryFree) {
    this.memoryFree = memoryFree;
  }

  onSetMemoryBuffcache(memoryBuffcache) {
    this.memoryBuffcache = memoryBuffcache;
  }

  onSetSwapTotal(swapTotal) {
    this.swapTotal = swapTotal;
  }

  onSetSwapUsed(swapUsed) {
    this.swapUsed = swapUsed;
  }

  onSetSwapFree(swapFree) {
    this.swapFree = swapFree;
  }

  onSetMemMemoryColour(colour) {
    this.memoryColours.mem = colour;
  }

  onSetSwapMemoryColour(colour) {
    this.memoryColours.swap = colour;
  }
}

export default alt.createStore(OverallMemoryUsage, 'OverallMemoryUsage');
