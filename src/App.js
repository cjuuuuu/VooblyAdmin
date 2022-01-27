import React from "react";
import { Route, Switch } from "react-router-dom";
import Authebticated from "./Components/Authebticated";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Nav from "./Fragments/Nav";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Authebticated>
          <Nav />
        </Authebticated>
      </Route>
      <Route exact path="/Login">
        <Authebticated nonAuthenticated={true}>
          <Login />
        </Authebticated>
      </Route>
      <Route path="*" render={() => "404 Not Found!"} />
    </Switch>
  );
}

export default App;
