const rp = require('request-promise');

//post a request for standings then return the max on that page
const getMax = async (leagueId) => {
  //initialization
  let page = 1;
  let start = new Date().getTime();

  const options = {
    url: `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=${page}&phase=1`,
    json: true,
  };

  //1st request is always made
  firstRes = await rp(options);
  let results = firstRes.standings.results;
  let scores = [],
    winners = [];

  //if there are results, carry on
  while (results.length !== 0) {
    //1st page : push first 3 scores
    scores.push(
      results.reduce((curr, next) =>
        curr.event_total > next.event_total ? curr : next
      ).event_total
    );
    //push second higher score
    scores.push(
      results.reduce((curr, next) =>
        curr.event_total > next.event_total && curr.event_total !== scores[0]
          ? curr
          : next
      ).event_total
    );
    //push third highest score
    scores.push(
      results.reduce((curr, next) =>
        curr.event_total > next.event_total &&
        !scores.includes(curr.event_total)
          ? curr
          : next
      ).event_total
    );

    //concat the three winners to winners, sort and take first three
    winners = winners.concat(
      results.filter((x) => scores.includes(x.event_total))
    );

    //if we have more than one page (more than 3 winners), sort and take first 3 winners
    if (winners.length > 3) {
      winners.sort((a, b) => b.event_total - a.event_total).splice(3);
    }
    console.log(`Reading page no: ${page}`);

    //make the next request
    options.url = `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=1&page_standings=${++page}&phase=1`;
    res = await rp(options);
    standings = res.standings;
    results = standings.results;
  }

  //display time
  let end = new Date().getTime();
  let time = end - start;
  console.log('Execution time: ' + time / 1000 + 's');
  const a = winners.map((w) => ({
    name: w.entry_name,
    points: w.event_total,
    url: `https://fantasy.premierleague.com/entry/${w.entry}/history`,
  }));
  const result = {
    winners: a,
    execution_time: time / 1000 + ' s',
    league_total_pages: page - 1,
  };
  return result;
};

module.exports = getMax;
