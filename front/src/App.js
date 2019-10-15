import React, { Component } from "react";
import Loader from "./Loader";
import Winners from "./Winners";

import axios from "axios";
import "./App.css";
import logo from "./logo.svg";

class App extends Component {
  state = {
    status: "",
    id: null,
    loading: false,
    winners: []
  };

  //helper function for handleSubmit
  getMaxFromPage = results => {
    const maxPoints = results.reduce((prev, curr) =>
      prev.points > curr.points ? prev : curr
    )["points"];
    return results.filter(r => r.points === maxPoints);
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ status: "Fetching Results", loading: true });

    try {
      let firstRes = await axios.get(`http://localhost:4000/${this.state.id}`);
      this.setState({ status: "Fetching Winners" });
      setTimeout(() => {
        this.setState({
          status: `execution time: ${firstRes.data.execution_time}`,
          winners: firstRes.data.winners.flat(),
          loading: false
        });
      }, 1000);
    } catch (err) {
      this.setState({ status: "League not found !", loading: false });
    }
  };

  handleChange = e => {
    this.setState({ id: e.target.value.replace(/\D/, "") });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="Logo"></img>
          <form onSubmit={this.handleSubmit}>
            <div className="grid">
              <div>
                <input
                  type="text"
                  value={this.state.id || ""}
                  onChange={this.handleChange}
                  id="id"
                  name="id"
                  placeholder="League ID"
                />
              </div>
              <div>
                <button
                  type="submit"
                  value="submit"
                  disabled={this.state.loading}
                  className={this.state.loading ? "clicked" : "normal"}
                >
                  Go!
                </button>
              </div>
            </div>
          </form>

          <div className="loader-div">
            {this.state.loading ? <Loader></Loader> : null}
          </div>
          <div className="status">{this.state.status}</div>
          <div className="winners">
            {this.state.winners.length !== 0 ? (
              <Winners data={this.state.winners}></Winners>
            ) : null}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
