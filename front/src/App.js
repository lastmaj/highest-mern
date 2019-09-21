import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import logo from "./logo.svg";
import ThemeProvider from "./ThemeProvider";
import { Box, Button } from "rebass";
import { Label, Input } from "@rebass/forms";

class App extends Component {
  state = {
    status: "",
    id: null
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
    this.setState({ status: "entering the void" });
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
    console.log(winners.flat());
    this.setState({ status: "All is Well" });
  };

  handleChange = e => {
    this.setState({ id: e.target.value.replace(/\D/, "") });
  };

  render() {
    return (
      <ThemeProvider>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="Logo"></img>
            <form onSubmit={this.handleSubmit}>
              <label>
                League id:
                <inputcd
                  type="text"
                  value={this.state.id || ""}
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Submit" />
              <Box>
                <Label htmlFor="email">Email</Label>
                <Input id="id" name="id" placeholder="5828" />
                <Button>Beep</Button>
              </Box>
            </form>
            <p>{this.state.status}</p>
          </header>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
