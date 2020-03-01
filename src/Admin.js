import React, { Component } from "react";

class Admin extends Component {
  state = {
    message: "Hola"
  };

  componentDidMount() {
    fetch("/admin", {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Network response was not valid.");
      })
      .then(response => {
        this.setState({ message: response.message });
      })
      .catch(error => {
        this.setState({ message: "Not an admin" });
      });
  }

  render() {
    return (
      <div>
        <p> {this.state.message}</p>
      </div>
    );
  }
}

export default Admin;
