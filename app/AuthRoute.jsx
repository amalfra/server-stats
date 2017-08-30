import React from 'react'
import { Route } from 'react-router-dom'

const AuthRoute = (component, ...props) => {
  const { isPrivate } = component.component

  // TODO: replace with actual auth check logic
  if (true) {
    return <Route {...props} component={component.component} />
  }
  // if route is private, user is redirected to app's public root,
  // else user proceeds
  return isPrivate
    ? <Redirect to='/' />
    : <Route {...props} component={component.component} />
}

export default AuthRoute
