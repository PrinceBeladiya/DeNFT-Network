import React, { Fragment } from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import Landing from './scenes/landing/Landing';
import Dialogs from './dialogs';

import history from './history';
import MarketPlace from './modules/marketPlace/MarketplaceContainer';
import MintContainer from './modules/mint/MintContainer';
import MynftsContainer from './modules/myntfs/MynftsContainer';
import BuyCrypto from './scenes/buy-crypto/BuyCrypto';
import Auth from './hoc/auth';

const Routes = () => (
  <Router
    history={history}
  >
    <Fragment>
      <Switch>
        <Route exact path="/" component={Auth(MarketPlace)} />
      </Switch>
      <Switch>
        <Route exact path="/marketplace" component={Auth(MarketPlace)} />
      </Switch>
      <Switch>
        <Route exact path="/mint" component={Auth(MintContainer)} />
      </Switch>
      <Switch>
        <Route exact path="/my-nfts" component={Auth(MynftsContainer)} />
      </Switch>
      <Switch>
        <Route exact path="/buy-crypto" component={Auth(BuyCrypto)} />
      </Switch>
      <Dialogs />
    </Fragment>
  </Router>
);

export default Routes;
