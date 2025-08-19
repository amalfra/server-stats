import OverallMemoryUsageSource from '../OverallMemoryUsage';
import SSHConnection from '../../../lib/SSHConnection';

describe('OverallMemoryUsage', () => {
  it('fetch returning error', async () => {
    SSHConnection.exec = jest.fn().mockRejectedValue(new Error('SSH error'));

    await expect(
      OverallMemoryUsageSource.fetch(),
    ).rejects.toThrow('SSH error');
  });

  it('fetch returning result old format', () => {
    const fakeMetric = 'Mem: 16038 15653 384 0 236 14788\n'
+ '-/+ buffers/cache: 628 15409\n'
+ 'Swap: 16371 83 16288';
    const fakeMetricProcessed = {
      mem: {
        total: 16038,
        available: 15408,
        used: 630,
        free: 384,
        buffcache: 15024,
      },
      swap: {
        total: 16371,
        used: 83,
        free: 16288,
      },
    };
    SSHConnection.exec = jest.fn(() => Promise.resolve(fakeMetric));
    const returnVal = OverallMemoryUsageSource.fetch();

    return expect(returnVal).resolves.toEqual(fakeMetricProcessed);
  });

  it('fetch returning result new format', () => {
    const fakeMetric = 'Mem: 16038 628 386 0 15024 14788\n'
+ 'Swap: 16371 83 16288';
    const fakeMetricProcessed = {
      mem: {
        total: 16038,
        available: 14788,
        used: 628,
        free: 386,
        buffcache: 15024,
      },
      swap: {
        total: 16371,
        used: 83,
        free: 16288,
      },
    };
    SSHConnection.exec = jest.fn(() => Promise.resolve(fakeMetric));
    const returnVal = OverallMemoryUsageSource.fetch();

    return expect(returnVal).resolves.toEqual(fakeMetricProcessed);
  });
});
