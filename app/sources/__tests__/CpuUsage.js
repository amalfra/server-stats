import { expect } from 'chai';
import { stub } from 'sinon';

import CpuUsageSource from '../CpuUsage';
import SSHConnection from '../../lib/SSHConnection';

describe('CpuUsageSource', () => {
  let fakeExec = null;

  afterEach(() => {
    fakeExec.restore();
  });

  it('fetch returning error', () => {
    fakeExec = stub(SSHConnection, 'exec')
      .rejects(new Error('SSH error'));
    const returnVal = CpuUsageSource.fetch();

    return expect(returnVal).to.be.rejectedWith('SSH error');
  });

  it('fetch returning result 1 cpu', () => {
    const fakeMetric = '  1852494 8325 793999 7625013 78871 0 5813 0 0 0\n'
+ '0 484262 1868 198303 3113528 31418 0 1448 0 0 0';
    const fakeMetricProcessed = ['0 484262 1868 198303 3113528 31418 0 1448 0 0 0'];
    fakeExec = stub(SSHConnection, 'exec').resolves(fakeMetric);
    const returnVal = CpuUsageSource.fetch();

    return expect(returnVal).to.eventually.have.all
      .members(fakeMetricProcessed);
  });

  it('fetch returning result multiple cpus', () => {
    fakeExec = stub(SSHConnection, 'exec')
      .resolves('  1852494 8325 793999 7625013 78871 0 5813 0 0 0\n'
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

    return expect(returnVal).to.eventually.have.all
      .members(fakeMetricProcessed);
  });
});
