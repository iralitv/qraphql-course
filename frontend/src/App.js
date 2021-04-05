import React from "react";
import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";

import AuthContext from './context/auth-context';

function App() {
  const [state, setState] = React.useState({ token: null, userId: null })
  const login = (token, userId, tokenExpiration) => {
    setState({ token: token, userId: userId });
  };

  const logout = () => {
    setState({ token: null, userId: null });
  };

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider 
          value={{
            token: state.token, 
            userId: state.userId, 
            login, 
            logout
          }}>
          <MainNavigation />
          <main className="main-content">
            <Switch>
                {state.token && <Redirect from="/" to="/events" exact />}
                {state.token && <Redirect from="/auth" to="/events" exact />}

                <Route path="/events" component={EventsPage} />
                {!state.token && <Route path="/auth" component={AuthPage} />}
                {state.token && <Route path="/bookings" component={BookingsPage} />}
                {!state.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
