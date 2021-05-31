import React from "react";
import Menu from "./components/menu";

import Typography from "@material-ui/core/Typography";

import Loader from "./components/loader";

import Anonimous from "./components/anonimous";
import ShowExamples from "./components/showExamples";
import CreateTask from "./components/createTask";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import StyleSelect from "./components/styleSelector";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      has_errors: null,
      errors: null,
      value: 0,
    };
  }

  render() {
    return (
      <div>
        <Router>
          <Menu />
          <Switch>
            <Route path="/examples">
              <ShowExamples />
            </Route>
            <Route
              path="/loader"
              component={sessionStorage.getItem("login") == "true" ? Loader : Anonimous}
            />
            <Route path="/create_task" component={CreateTask} />
            <Route path="/create_style" component={StyleSelect} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
