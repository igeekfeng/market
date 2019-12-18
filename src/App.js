import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import router from './work/router'


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          {router.map(
            ({path, componentName, exact = true, routes = []}, key) => {
              return (
                <Route
                  exact={exact}
                  key={key}
                  path={path}
                  component={componentName}
                />
              )
            })}
        </div>
      </Router>
    )
  }
}

export default App
