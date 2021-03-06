import { assert } from 'chai';

import alt from '../../lib/alt';
import CpuUsageStore from '../CpuUsage';
import CpuUsageActions from '../../actions/CpuUsage';

describe('CpuUsageStore', () => {
  it('listens for setCpuUsageData action', () => {
    const data = {
      labels: ['label 1', 'label 2'],
      datasets: [10, 5],
    }; const
      action = CpuUsageActions.SET_CPU_USAGE_DATA;
    alt.dispatcher.dispatch({ action, data });

    assert.deepEqual(CpuUsageStore.getState().cpuUsageData.labels, data.labels);
    assert.deepEqual(CpuUsageStore.getState().cpuUsageData.datasets,
      data.datasets);
  });

  it('listens for setUpdatedAgo action', () => {
    const data = new Date(); const
      action = CpuUsageActions.SET_UPDATED_AGO;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(CpuUsageStore.getState().updatedAgo, data);
  });
});
