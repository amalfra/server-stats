import Utils from '../Utils';

describe('Utils', () => {
  it('capitalizeFirstLetter with all lowercase', () => {
    expect(Utils.capitalizeFirstLetter('utils')).toEqual('Utils');
  });

  it('capitalizeFirstLetter with all uppercase', () => {
    expect(Utils.capitalizeFirstLetter('UTILS')).toEqual('UTILS');
  });

  it(
    'capitalizeFirstLetter with first letter uppercase and rest mixed case',
    () => {
      expect(Utils.capitalizeFirstLetter('UTilS')).toEqual('UTilS');
    },
  );

  it('findSecondsAgo', () => {
    const ftime = new Date();
    setTimeout(() => {
      expect(Utils.findSecondsAgo(ftime)).toEqual('2.0');
    }, 2000);
  });

  it('getRandomColour', () => {
    const validColours = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue',
      'violet', 'purple', 'pink', 'brown', 'grey', 'black'];
    expect(validColours).toContain(Utils.getRandomColour());
  });

  it('humanMemorySize with 0 size', () => {
    expect(Utils.humanMemorySize(0)).toEqual('0 B');
  });

  it('humanMemorySize with byte size', () => {
    expect(Utils.humanMemorySize(500)).toEqual('500 B');
  });

  it('humanMemorySize with kB size', () => {
    expect(Utils.humanMemorySize(2040)).toEqual('1.99 kB');
  });

  it('humanMemorySize with MB size', () => {
    expect(Utils.humanMemorySize(536870912)).toEqual('512 MB');
  });

  it('humanMemorySize with GB size', () => {
    expect(Utils.humanMemorySize(2147483648)).toEqual('2 GB');
  });

  it('humanMemorySize with TB size', () => {
    expect(Utils.humanMemorySize(1099511627776)).toEqual('1 TB');
  });
});
