import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';

import CpuUsage from '../CpuUsage';

describe('<CpuUsage />', () => {
  it('renders', () => {
    const wrapper = shallow(<CpuUsage />);

    assert(wrapper.find('LineChart')).to.have.lengthOf(1);
  });
});
