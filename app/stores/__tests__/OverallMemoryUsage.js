import { assert } from 'chai'

import alt from '../../lib/alt'
import OverallMemoryUsageStore from '../OverallMemoryUsage'
import OverallMemoryUsageActions from '../../actions/OverallMemoryUsage'

describe('OverallMemoryUsageStore', () => {
  it('listens for setOverallMemoryUsageData action', () => {
    var data = {
      labels: ['label 1', 'label 2'],
      datasets: [10, 5]
    }, action = OverallMemoryUsageActions.SET_OVERALL_MEMORY_USAGE_DATA
    alt.dispatcher.dispatch({action, data})

    assert.deepEqual(OverallMemoryUsageStore.getState().overallMemoryUsageData
      .labels, data.labels)
    assert.deepEqual(OverallMemoryUsageStore.getState().overallMemoryUsageData
      .datasets, data.datasets)
  })

  it('listens for setUpdatedAgo action', () => {
    var data = new Date(), action = OverallMemoryUsageActions.SET_UPDATED_AGO
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().updatedAgo, data)
  })

  it('listens for setMemoryTotal action', () => {
    var data = 10, action = OverallMemoryUsageActions.SET_MEMORY_TOTAL
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().memoryTotal, data)
  })

  it('listens for setMemoryAvailable action', () => {
    var data = 10, action = OverallMemoryUsageActions.SET_MEMORY_AVAILABLE
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().memoryAvailable, data)
  })

  it('listens for setMemoryUsed action', () => {
    var data = 10, action = OverallMemoryUsageActions.SET_MEMORY_USED
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().memoryUsed, data)
  })

  it('listens for setMemoryFree action', () => {
    var data = 10, action = OverallMemoryUsageActions.SET_MEMORY_FREE
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().memoryFree, data)
  })

  it('listens for setMemoryBuffcache action', () => {
    var data = 10, action = OverallMemoryUsageActions.SET_MEMORY_BUFFCACHE
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().memoryBuffcache, data)
  })

  it('listens for setSwapTotal action', () => {
    var data = 10, action = OverallMemoryUsageActions.SET_SWAP_TOTAL
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().swapTotal, data)
  })

  it('listens for setSwapUsed action', () => {
    var data = 10, action = OverallMemoryUsageActions.SET_SWAP_USED
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().swapUsed, data)
  })

  it('listens for setSwapFree action', () => {
    var data = 10, action = OverallMemoryUsageActions.SET_SWAP_USED
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().swapUsed, data)
  })

  it('listens for setMemMemoryColour action', () => {
    var data = 'red', action = OverallMemoryUsageActions.SET_MEM_MEMORY_COLOUR
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().memoryColours.mem, data)
  })

  it('listens for setSwapMemoryColour action', () => {
    var data = 'red', action = OverallMemoryUsageActions.SET_SWAP_MEMORY_COLOUR
    alt.dispatcher.dispatch({action, data})

    assert.equal(OverallMemoryUsageStore.getState().memoryColours.swap, data)
  })
})
