import React, { Component } from 'react';

import ListOfCapitals from './ListOfCities/index'
import Favorites from './Favorites/index'
import Header from './Header/index'

import { Route, Switch, BrowserRouter } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className='container'>
          <Header />
          <Switch>
            <Route exact path={"/"} component={ListOfCapitals}></Route>
            <Route exact path={"/favorites"} component={Favorites}></Route>
          </Switch>
        </div>
      </BrowserRouter>

      // <div className='container'>
      //   <Navbar />
      //   <ListOfCapitals />
      // </div>
    )
  }
}

export default App;
