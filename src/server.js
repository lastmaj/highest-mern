const express = require('express'),
  highest = require('./highest.js'),
  path = require('path');

const app = express();

//request number of pages in a league
/*app.get("/:id", async (req, res, next) => {
  res.header("Content-Type", "application/json");
  pages(req.params.id)
    .then(pages => res.send(pages))
    .catch(err => next(err));
});
*/

//request league page
//2nd way to error handle; try catch blocks
//could have used the default express error handler (ex: /:id route)
app.get('/:id', async (req, res) => {
  req.setTimeout(0);
  res.header('Content-Type', 'application/json');
  try {
    const result = await highest(req.params.id);
    res.send(JSON.stringify(result));
  } catch (err) {
    res.status(err.response.status).send(err.response.statusText);
  }
});

//capture the annoying favicon.ico request
app.get('/favicon.ico', (_, res) => res.status(204));

//error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.response.status).send(err.response.statusText);
});

//prod environment
if (process.env.NODE_ENV === 'production') {
  //uses the express static middleware to grab the build folder
  //when react is built, the app is going to be in the indicated folder
  app.use(express.static(path.resolve(__dirname, '../client/build')));

  //SPA: always return the index.html
  //check what the first part means though
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

//landing page
app.get('/', (_, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log('server is running on 4000');
});
