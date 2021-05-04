import React, { Component } from "react";
import { ErrorPage } from "../src/components/other";

class AccessDenied extends Component {
  render() {
    return (
      <ErrorPage text="Error: You do not have permission to access this page." />
    );
  }
}

export default AccessDenied;
