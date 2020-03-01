import React, { Component } from "react";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Auth from "./Auth/Auth";
import Home from "./Home";
import Nav from "./Nav";
import Profile from "./Profile";
import Callback from "./Callback";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";
import Admin from "./Admin";
import AuthContext from "./AuthContext";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(this.props.history),
      tokenRenewalComplete: false
    };
  }

  componentDidMount() {
    this.state.auth.renewToken(() =>
      this.setState({ tokenRenewalComplete: true })
    );
    // this.setState({ tokenRenewalComplete: true });
  }

  render() {
    const { auth } = this.state;
    // Show loading message until the token renewal check is completed.
    if (!this.state.tokenRenewalComplete) return "Loading...";
    return (
      <AuthContext.Provider value={auth}>
        <Nav auth={auth} />
        <div className="body">
          <PublicRoute path="/" component={Home} />
          <PublicRoute path="/callback" component={Callback} />
          <PublicRoute path="/public" component={Public} />
          <PrivateRoute path="/private" component={Private} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute
            path="/courses"
            component={Courses}
            scopes={["read:courses"]}
          />
          <PrivateRoute path="/admin" component={Admin} />
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
