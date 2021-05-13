import React, { useState, useEffect } from 'react'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login"

import { useHttp } from '../hooks/http.hook'

const AdminRouter = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const { request } = useHttp()
  
  const checkToken = async () => {
    try {
      const isAdmin = await request('/auth/is-admin', 'POST', {}, false, { authorization: localStorage.getItem('admin_token') })
      
      if (isAdmin) {
        setIsAdmin(true)
      } else {
        localStorage.removeItem('token')
      }

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('admin_token')) {
      checkToken()
    }
  }, [])

  if (isAdmin) {
    return (
      <Router>
        <Switch>
            <Route exact path="/admin" >
                Вы вошли
            </Route>
        </Switch>
      </Router>
    )
  } else {
    return (
      <Router>
        <Switch>
          <Route exact path="/admin" component={Login} />

          <Route exact path="/admin/*" component={Login} />
        </Switch>
      </Router>
    )
  }
  
};

export default AdminRouter;