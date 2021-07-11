import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./Main";
import AdminRouter from "./Admin/router"
import LkRouter from "./Lk/router";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/admin" component={ AdminRouter } />
        <Route exact path="/admin/*" component={ AdminRouter } />

        <Route exact path="/lk" component={ LkRouter } />
        <Route exact path="/lk/*" component={ LkRouter } />

        <Route exact path="/reg" component={ LkRouter } />
        <Route exact path="/reg/*" component={ LkRouter } />

        <Route path="/*" component={ Main } />
      </Switch>
    </Router>
  )
}

export default App;
