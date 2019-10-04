const express = require("express");
const highest = require("./highest.js");
const pages = require("./pages.js");
const cors = require("cors");

const app = express();
app.use(cors());

//landing page
app.get("/", (_, res) => {
  res.send("Hello World");
});

//request number of pages in a league
app.get("/:id", async (req, res, next) => {
  res.header("Content-Type", "application/json");
  pages(req.params.id)
    .then(pages => res.send(pages))
    .catch(err => next(err));
});

//request league page
app.get("/:id/:page", async (req, res) => {
  res.header("Content-Type", "application/json");
  res.send(
    JSON.stringify(await highest(req.params.id, req.params.page), null, 4)
  );
});

//capture the annoying favicon.ico request
app.get("/favicon.ico", (_, res) => res.status(204));

//error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.response.status).send(err.response.statusText);
});

app.listen(4000, () => {
  console.log("server is running on 4000");
});
