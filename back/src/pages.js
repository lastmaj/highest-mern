const axios = require("axios");
const loginURL = "https://users.premierleague.com/accounts/login/";
const axiosInstace = axios.create({ baseURL: loginURL });

//set cookie manually, then attach it to axios's headers
const createSession = async () => {
  //manually setting the cookie
  const cookie =
    "pl_profile=eyJzIjogIld6SXNORFUwTVRNNU1qSmQ6MWkyZlJPOlFUQ3djbGp2MllUNnMwck5DbWg3NVFiUEhpZyIsICJ1IjogeyJpZCI6IDQ1NDEzOTIyLCAiZm4iOiAiQWhtZWQiLCAibG4iOiAiTWVqYnJpIiwgImZjIjogMX19; expires=Tue, 25 Aug 2020 17:38:58 GMT; Max-Age=31449600 Path=/; SameSite=";
  axiosInstace.defaults.headers.Cookie = cookie;
};

const getPages = leagueId => {
  return new Promise(resolve => {
    createSession().then(async () => {
      //1st request is always made
      let page = 1;
      firstRes = await axiosInstace.get(
        `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=${page}&phase=1`
      );
      standings = await firstRes.data.standings;
      results = await standings.results;

      while (results.length !== 0) {
        //make the next request
        console.log("reading page : ", page);
        page++;

        res = await axiosInstace.get(
          `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=${page}&phase=1`
        );
        standings = await res.data.standings;
        results = await standings.results;
      }
      console.log(page);
      resolve(page.toString());
    });
  });
};

module.exports = getPages;
