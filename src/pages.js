const rp = require('request-promise');

const getPages = async (leagueId) => {
  createSession();

  let page = 1;
  const options = {
    url: `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=${page}&phase=1`,
    json: true,
  };

  firstRes = await rp(options);

  let results = firstRes.standings.results;

  while (results.length !== 0) {
    //make the next request
    options.url = `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=${++page}&phase=1`;
    res = await rp(options);
    standings = res.standings;
    results = standings.results;
  }
  return page.toString();
};

module.exports = getPages;
