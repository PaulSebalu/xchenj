import React from "react";

import Routes from "./routes/appRoutes";

export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Routes />
      </React.Fragment>
    );
  }
}
