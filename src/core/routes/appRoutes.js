import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "../../components/CurrencyExchange";

import * as paths from "./appPaths";

const Routes = () => (
  <Switch>
    <Route exact path={paths.baseUrl} component={Home} />
  </Switch>
);

export default Routes;
