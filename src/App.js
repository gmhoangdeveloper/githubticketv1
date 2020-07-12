import React from 'react';
import './App.css';
import Github from './component/github/Github';
import Issues from './component/Issues/Issues';
import Labels from './component/Labels/Labels';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Github} />
          <Route exact path="/issues" component={Issues} />
          <Route exact path="/Labels" component={Labels} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;

