import React, { useState, useEffect } from 'react'

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login"
import Reg from "./Reg"

import { useHttp } from '../hooks/http.hook'

const LkRouter = () => {
  const [isAuth, setIsAuth] = useState(false)
  const { request } = useHttp()
  
  const checkToken = async () => {
    try {
      const isAuth = await request('/auth/is-auth', 'POST', {}, false)
      
      if (isAuth) {
        setIsAuth(true)
      } else {
        localStorage.removeItem('auth_token')
      }

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      checkToken()
    }
  }, [])

  if (isAuth) {
    return (
      <Router>
        <Switch>
            <Route exact path="/lk" >
                Вы вошли
            </Route>
            <Route exact path="/reg">
              <Redirect to="/lk" />
            </Route>
        </Switch>
      </Router>
    )
  } else {
    return (
      <Router>
        <Switch>
          <Route exact path="/lk" component={Login} />

          <Route exact path="/lk/*" component={Login} />

          <Route exact path="/reg" component={Reg} />

          <Route exact path="/reg/*" component={Reg} />
        </Switch>
      </Router>
    )
  }
  
};

export default LkRouter;