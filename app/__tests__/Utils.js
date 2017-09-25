import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { assert } from 'chai'

import Utils from '../Utils'

global.before(function () {
  chai.should()
  chai.use(chaiAsPromised)
})

describe('Utils', () => {
  it('capitalizeFirstLetter with all lowercase', () => {
    assert.equal(Utils.capitalizeFirstLetter('utils'), 'Utils')
  })

  it('capitalizeFirstLetter with all uppercase', () => {
    assert.equal(Utils.capitalizeFirstLetter('UTILS'), 'UTILS')
  })

  it('capitalizeFirstLetter with first letter uppercase and rest mixed case',
    () => {
      assert.equal(Utils.capitalizeFirstLetter('UTilS'), 'UTilS')
  })

  it('findSecondsAgo', () => {
    var ftime = new Date()
    setTimeout(() => {
      assert.equal(Utils.findSecondsAgo(ftime), 2)
    }, 2000)
  })

  it('getRandomColour', () => {
    var validColours = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue',
      'violet', 'purple', 'pink', 'brown', 'grey', 'black']
    assert.include(validColours, Utils.getRandomColour())
  })
})
