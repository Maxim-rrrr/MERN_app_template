import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./Main";
import AdminRouter from "./Admin/router"

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/admin" component={ AdminRouter } />
        <Route exact path="/admin/*" component={ AdminRouter } />

        <Route path="/*" component={ Main } />
      </Switch>
    </Router>
  )
}

export default App;
