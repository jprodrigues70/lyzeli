import {
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import routes from "./routerex.js"

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          {routes()}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
