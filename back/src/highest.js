const axios = require("axios");
const loginURL = "https://users.premierleague.com/accounts/login/";
const axiosInstace = axios.create({ baseURL: loginURL });

//implement array.flat()
Object.defineProperty(Array.prototype, "flat", {
  value: function(depth = 1) {
    return this.reduce(function(flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten
      );
    }, []);
  }
});

//set cookie manually, then attach it to axios's headers
const createSession = async () => {
  //manually setting the cookie
  const cookie =
    "pl_profile=eyJzIjogIld6SXNORFUwTVRNNU1qSmQ6MWkyZlJPOlFUQ3djbGp2MllUNnMwck5DbWg3NVFiUEhpZyIsICJ1IjogeyJpZCI6IDQ1NDEzOTIyLCAiZm4iOiAiQWhtZWQiLCAibG4iOiAiTWVqYnJpIiwgImZjIjogMX19; expires=Tue, 25 Aug 2020 17:38:58 GMT; Max-Age=31449600 Path=/; SameSite=";
  axiosInstace.defaults.headers.Cookie = cookie;
};

//get the max standing from a standings page
const getMaxFromPage = results => {
  const maxPoints = results.reduce((prev, curr) =>
    prev.event_total > curr.event_total ? prev : curr
  )["event_total"];
  return results.filter(r => r.event_total === maxPoints);
};

//post a request for standings then return the max on that page
const getMax = (leagueId, page) => {
  return new Promise(resolve => {
    createSession().then(async () => {
      //1st request is always made
      firstRes = await axiosInstace.get(
        `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=${page}&phase=1`
      );
      standings = await firstRes.data.standings;
      results = await standings.results;
      resolve(
        results.map(r => ({
          name: r.entry_name,
          points: r.event_total,
          url: `https://fantasy.premierleague.com/entry/${r.entry}/history`
        }))
      );
    });
  });
};

module.exports = getMax;
