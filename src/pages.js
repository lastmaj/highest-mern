const axios = require("axios");
const axiosInstance = axios.create({
  baseURL: `https://fantasy.premierleague.com/api/leagues-classic/`
});

//set cookie manually, then attach it to axios's headers
const createSession = () => {
  const cookie =
    "pl_profile=eyJzIjogIld6SXNORFUwTVRNNU1qSmQ6MWkyZlJPOlFUQ3djbGp2MllUNnMwck5DbWg3NVFiUEhpZyIsICJ1IjogeyJpZCI6IDQ1NDEzOTIyLCAiZm4iOiAiQWhtZWQiLCAibG4iOiAiTWVqYnJpIiwgImZjIjogMX19; expires=Tue, 25 Aug 2020 17:38:58 GMT; Max-Age=31449600 Path=/; SameSite=";
  axiosInstance.defaults.headers.Cookie = cookie;
};

const getPages = async leagueId => {
  createSession();

  let page = 1;
  firstRes = await axiosInstance.get(
    `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=${page}&phase=1`
  );
  standings = await firstRes.data.standings;
  results = await standings.results;

  while (results.length !== 0) {
    //make the next request
    page++;
    res = await axiosInstance.get(
      `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=${page}&phase=1`
    );
    standings = await res.data.standings;
    results = await standings.results;
  }
  return page.toString();
};

module.exports = getPages;
