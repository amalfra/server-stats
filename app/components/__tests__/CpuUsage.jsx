import React from 'react';
import { shallow } from 'enzyme';
import { expect, assert } from 'chai';
import { stub } from 'sinon';

import CpuUsage from '../CpuUsage';

// Let's create our mocked version of the libraries
const Meteor = {
  loginWithPassword: null,
};
const Router = {
  Actions: {
    dashboard: null,
  },
};

function clickOnLoginBtn(credentials) {
  const wrapper = shallow(<CpuUsage />);

  wrapper.setState(credentials);
  wrapper.find('TouchableHighlight').prop('onPress')();
}

describe('<CpuUsage />', () => {
  const credentials = {
    email: 'user@email.com',
    password: 'password',
  };

  it('should call Meteor.loginWithPassword whenever TouchableHighlight gets pressed', () => {
    Meteor.loginWithPassword = stub();
    clickOnLoginBtn(credentials);

    const callArgs = Meteor.loginWithPassword.args[0];
    assert(Meteor.loginWithPassword.called);
    expect(callArgs[0]).to.equal(credentials.email);
    expect(callArgs[1]).to.equal(credentials.password);
    expect(callArgs[2]).to.be.a('function');
  });

  it('should call Actions.dashboard on successul login', () => {
    Router.Actions.dashboard = stub();
    // Call last arg which is the callback with null assigned to error
    Meteor.loginWithPassword = stub().callsArgWith(2, null);

    clickOnLoginBtn(credentials);

    assert(Router.Actions.dashboard.calledOnce);
  });

  it('should not call Actions.dashboard on unsuccessul login', () => {
    Router.Actions.dashboard = stub();
    // Call last arg which is the callback with null assigned to error
    Meteor.loginWithPassword = stub().callsArgWith(2, true);

    clickOnLoginBtn(credentials);

    // eslint-disable-next-line no-unused-expressions
    expect(Router.Actions.dashboard.calledOnce).to.be.false;
  });
});
