import React from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import Header from '../components/base/Header';
import MapView from './map'
import withRoot from '../withRoot';

const App = () => (
  <div className="app__container">
    <Header>
      <Link to="/">
        <img 
          alt="Educational Opportunity Project" 
          src="/assets/img/seda-light.svg"
        />
      </Link>
    </Header>

    <main className="body">
      <Route exact path="/" render={() => (<Redirect to="/counties/avg/all/3.5/38/-97"/>)} />
      <Route path="/:region/:metric/:demographic/:zoom/:lat/:lon/:locations?" component={ MapView } />
    </main>
  </div>
)

export default withRoot(App)
