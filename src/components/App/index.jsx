import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import Route from 'react-router/lib/Route';
import Router from 'react-router/lib/Router';
import IndexRoute from 'react-router/lib/IndexRoute';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import create from '../../redux/store';
import { APP_META_DATA } from '../../constants/metadata';
import MainLayout from '../MainLayout'
import NotFound from '../NotFound'

const store = create();
const App = () => (
  <Provider {...{ store }}>
    <div
      className="App relative"
    >
      <Helmet {...{ ...APP_META_DATA }} />
      <Router
        history={syncHistoryWithStore(browserHistory, store)}
      >
        <Route
          path="/"
          component={MainLayout}
        >
          <IndexRoute
            component={() => <div style={{ fontSize: '5em', padding: '1em' }}>O HAI</div>}
          />
        </Route>
        <Route
          path="*"
          component={NotFound}
        />
      </Router>
    </div>
  </Provider>
);

export default App;
