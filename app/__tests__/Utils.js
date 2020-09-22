import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import Utils from '../Utils';

global.before(() => {
  chai.should();
  chai.use(chaiAsPromised);
});

describe('Utils', () => {
  it('capitalizeFirstLetter with all lowercase', () => {
    assert.equal(Utils.capitalizeFirstLetter('utils'), 'Utils');
  });

  it('capitalizeFirstLetter with all uppercase', () => {
    assert.equal(Utils.capitalizeFirstLetter('UTILS'), 'UTILS');
  });

  it('capitalizeFirstLetter with first letter uppercase and rest mixed case',
    () => {
      assert.equal(Utils.capitalizeFirstLetter('UTilS'), 'UTilS');
    });

  it('findSecondsAgo', () => {
    const ftime = new Date();
    setTimeout(() => {
      assert.equal(Utils.findSecondsAgo(ftime), 2);
    }, 2000);
  });

  it('getRandomColour', () => {
    const validColours = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue',
      'violet', 'purple', 'pink', 'brown', 'grey', 'black'];
    assert.include(validColours, Utils.getRandomColour());
  });

  it('humanMemorySize with 0 size', () => {
    assert.equal(Utils.humanMemorySize(0), '0 B');
  });

  it('humanMemorySize with byte size', () => {
    assert.equal(Utils.humanMemorySize(500), '500 B');
  });

  it('humanMemorySize with kB size', () => {
    assert.equal(Utils.humanMemorySize(2040), '1.99 kB');
  });

  it('humanMemorySize with MB size', () => {
    assert.equal(Utils.humanMemorySize(536870912), '512 MB');
  });

  it('humanMemorySize with GB size', () => {
    assert.equal(Utils.humanMemorySize(2147483648), '2 GB');
  });

  it('humanMemorySize with TB size', () => {
    assert.equal(Utils.humanMemorySize(1099511627776), '1 TB');
  });
});
