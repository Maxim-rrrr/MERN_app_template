import React, { useState, useEffect } from 'react'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login"

import { useHttp } from '../hooks/http.hook'

const LkRouter = () => {
  const [isAuth, setIsAuth] = useState(false)
  const { request } = useHttp()
  
  const checkToken = async () => {
    try {
      const isAuth = await request('/auth/is-auth', 'POST', {}, false, { authorization: localStorage.getItem('admin_token') })
      
      if (isAuth) {
        setIsAuth(true)
      } else {
        localStorage.removeItem('token')
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
        </Switch>
      </Router>
    )
  } else {
    return (
      <Router>
        <Switch>
          <Route exact path="/lk" component={Login} />

          <Route exact path="/lk/*" component={Login} />
        </Switch>
      </Router>
    )
  }
  
};

export default LkRouter;