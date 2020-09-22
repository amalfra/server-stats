import { assert } from 'chai';

import alt from '../../lib/alt';
import OverallMemoryUsageStore from '../OverallMemoryUsage';
import OverallMemoryUsageActions from '../../actions/OverallMemoryUsage';

describe('OverallMemoryUsageStore', () => {
  it('listens for setOverallMemoryUsageData action', () => {
    const data = {
      labels: ['label 1', 'label 2'],
      datasets: [10, 5],
    }; const
      action = OverallMemoryUsageActions.SET_OVERALL_MEMORY_USAGE_DATA;
    alt.dispatcher.dispatch({ action, data });

    assert.deepEqual(OverallMemoryUsageStore.getState().overallMemoryUsageData
      .labels, data.labels);
    assert.deepEqual(OverallMemoryUsageStore.getState().overallMemoryUsageData
      .datasets, data.datasets);
  });

  it('listens for setUpdatedAgo action', () => {
    const data = new Date(); const
      action = OverallMemoryUsageActions.SET_UPDATED_AGO;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().updatedAgo, data);
  });

  it('listens for setMemoryTotal action', () => {
    const data = 10; const
      action = OverallMemoryUsageActions.SET_MEMORY_TOTAL;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().memoryTotal, data);
  });

  it('listens for setMemoryAvailable action', () => {
    const data = 10; const
      action = OverallMemoryUsageActions.SET_MEMORY_AVAILABLE;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().memoryAvailable, data);
  });

  it('listens for setMemoryUsed action', () => {
    const data = 10; const
      action = OverallMemoryUsageActions.SET_MEMORY_USED;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().memoryUsed, data);
  });

  it('listens for setMemoryFree action', () => {
    const data = 10; const
      action = OverallMemoryUsageActions.SET_MEMORY_FREE;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().memoryFree, data);
  });

  it('listens for setMemoryBuffcache action', () => {
    const data = 10; const
      action = OverallMemoryUsageActions.SET_MEMORY_BUFFCACHE;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().memoryBuffcache, data);
  });

  it('listens for setSwapTotal action', () => {
    const data = 10; const
      action = OverallMemoryUsageActions.SET_SWAP_TOTAL;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().swapTotal, data);
  });

  it('listens for setSwapUsed action', () => {
    const data = 10; const
      action = OverallMemoryUsageActions.SET_SWAP_USED;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().swapUsed, data);
  });

  it('listens for setSwapFree action', () => {
    const data = 10; const
      action = OverallMemoryUsageActions.SET_SWAP_USED;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().swapUsed, data);
  });

  it('listens for setMemMemoryColour action', () => {
    const data = 'red'; const
      action = OverallMemoryUsageActions.SET_MEM_MEMORY_COLOUR;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().memoryColours.mem, data);
  });

  it('listens for setSwapMemoryColour action', () => {
    const data = 'red'; const
      action = OverallMemoryUsageActions.SET_SWAP_MEMORY_COLOUR;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(OverallMemoryUsageStore.getState().memoryColours.swap, data);
  });
});
