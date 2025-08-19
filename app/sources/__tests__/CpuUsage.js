/**
 * @jest-environment jsdom
 */
import CpuUsageSource from '../CpuUsage';

describe('CpuUsageSource', () => {
  it('fetch returning error', async () => {
    window.electronAPI.execSSH.mockRejectedValue(new Error('SSH error'));

    await expect(
      CpuUsageSource.fetch(),
    ).rejects.toThrow('SSH error');
  });

  it('fetch returning result 1 cpu', () => {
    const fakeMetric = '  1852494 8325 793999 7625013 78871 0 5813 0 0 0\n'
+ '0 484262 1868 198303 3113528 31418 0 1448 0 0 0';
    const fakeMetricProcessed = ['0 484262 1868 198303 3113528 31418 0 1448 0 0 0'];
    window.electronAPI.execSSH.mockResolvedValue(fakeMetric);
    const returnVal = CpuUsageSource.fetch();

    return expect(returnVal).resolves.toEqual(fakeMetricProcessed);
  });

  it('fetch returning result multiple cpus', () => {
    window.electronAPI.execSSH.mockResolvedValue('  1852494 8325 793999 7625013 78871 0 5813 0 0 0\n'
+ '0 484262 1868 198303 3113528 31418 0 1448 0 0 0\n'
+ '1 450506 2680 188274 1520537 7338 0 1381 0 0 0\n'
+ '2 485692 2023 201847 1492574 13009 0 2594 0 0 0\n'
+ '3 432032 1752 205574 1498372 27104 0 390 0 0 0');
    const fakeMetricProcessed = [
      '0 484262 1868 198303 3113528 31418 0 1448 0 0 0',
      '1 450506 2680 188274 1520537 7338 0 1381 0 0 0',
      '2 485692 2023 201847 1492574 13009 0 2594 0 0 0',
      '3 432032 1752 205574 1498372 27104 0 390 0 0 0',
    ];
    const returnVal = CpuUsageSource.fetch();

    return expect(returnVal).resolves.toEqual(fakeMetricProcessed);
  });
});
