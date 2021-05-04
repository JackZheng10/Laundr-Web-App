import React, { Component } from "react";
import { ErrorPage } from "../../src/components/other";

class test extends Component {
  render() {
    return <ErrorPage text="This is an error message. Error code: 99." />;
  }
}

export default test;
