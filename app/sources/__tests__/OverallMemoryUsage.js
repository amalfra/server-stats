import { assert, expect } from 'chai'
import { stub } from 'sinon'

import OverallMemoryUsageSource from '../OverallMemoryUsage'
import SSHConnection from '../../lib/SSHConnection'

describe('OverallMemoryUsage', () => {
  let fakeExec = null

  afterEach(function(){
    fakeExec.restore()
  })

  it('fetch returning error', () => {
    fakeExec = stub(SSHConnection, 'exec')
      .rejects(new Error('SSH error'))
    let returnVal = OverallMemoryUsageSource.fetch()

    return expect(returnVal).to.be.rejectedWith('SSH error');
  })

  it('fetch returning result old format', () => {
    let fakeMetric = 'Mem: 16038 15653 384 0 236 14788\n' +
'-/+ buffers/cache: 628 15409\n' +
'Swap: 16371 83 16288';
    let fakeMetricProcessed = {
      'mem': {
        'total': 16038,
        'available': 15408,
        'used': 630,
        'free': 384,
        'buffcache': 15024
      },
      'swap': {
        'total': 16371,
        'used': 83,
        'free': 16288
      }
    }
    fakeExec = stub(SSHConnection, 'exec').resolves(fakeMetric)
    let returnVal = OverallMemoryUsageSource.fetch()

    return expect(returnVal).to.eventually.deep.equal(fakeMetricProcessed)
  })

  it('fetch returning result new format', () => {
    let fakeMetric = 'Mem: 16038 628 386 0 15024 14788\n' +
'Swap: 16371 83 16288';
    let fakeMetricProcessed = {
      'mem': {
        'total': 16038,
        'available': 14788,
        'used': 628,
        'free': 386,
        'buffcache': 15024
      },
      'swap': {
        'total': 16371,
        'used': 83,
        'free': 16288
      }
    }
    fakeExec = stub(SSHConnection, 'exec').resolves(fakeMetric)
    let returnVal = OverallMemoryUsageSource.fetch()

    return expect(returnVal).to.eventually.deep.equal(fakeMetricProcessed)
  })
})
