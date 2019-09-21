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
    this.setState({ status: "entering the void", loading: true });
    let page = 1;
    let maxs = [];
    let start = new Date().getTime();
    const leagueId = this.state.id;
    //1st request is always made
    let firstRes = await axios.get(`http://localhost:4000/${leagueId}/${page}`);
    let results = firstRes.data;

    //if there are results, carry on
    while (results.length !== 0) {
      this.setState({ status: `Reading page no: ${page}` });
      let pageMax = this.getMaxFromPage(await results);
      maxs.push(pageMax);
      //make the next request
      page++;
      let res = await axios.get(`http://localhost:4000/${leagueId}/${page}`);
      results = await res.data;
    }

    //helper array
    const winners = [];
    const helperArray = maxs.map(x => x[0]["points"]);
    const globalMax = Math.max(...helperArray);

    //iterate through maxs and helperArray
    let index = helperArray.indexOf(globalMax);
    while (index !== -1) {
      winners.push(maxs[index]);
      index = helperArray.indexOf(globalMax, index + 1);
    }

    //display time
    let end = new Date().getTime();
    let time = end - start;
    console.log("Execution time: " + time / 1000 + "s");
    this.setState({ status: "Data is ready" });
    setTimeout(() => {
      this.setState({
        loading: false,
        status: `execution time: ${time / 1000}s`,
        winners: winners.flat()
      });
    }, 1000);

    setTimeout(() => {
      this.setState({
        status: null
      });
    }, 5000);
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
                <button type="submit" value="submit">
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
