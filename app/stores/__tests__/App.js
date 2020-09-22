import { assert } from 'chai';

import alt from '../../lib/alt';
import AppStore from '../App';
import AppActions from '../../actions/App';

describe('AppStore', () => {
  it('listens for setIsAuthenticated action', () => {
    const data = true; const
      action = AppActions.SET_IS_AUTHENTICATED;
    alt.dispatcher.dispatch({ action, data });

    assert.equal(AppStore.getState().isAuthenticated, data);
  });
});
