import React, { Component } from "react";
import { ErrorPage } from "../src/components/other";

class MissingPage extends Component {
  render() {
    return <ErrorPage text="Error: Page not found." />;
  }
}

export default MissingPage;
