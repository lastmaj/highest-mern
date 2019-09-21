const express = require("express");
const highest = require("./highest.js");
const pages = require("./pages.js");
const cors = require("cors");

const app = express();
app.use(cors());

//landing page
app.get("/", (req, res) => {
  res.send("Hello World");
});

//request number of pages in a league
app.get("/:id", async (req, res) => {
  res.header("Content-Type", "application/json");
  res.send(await pages(req.params.id));
});

//request league page
app.get("/:id/:page", async (req, res) => {
  res.header("Content-Type", "application/json");
  res.send(
    JSON.stringify(await highest(req.params.id, req.params.page), null, 4)
  );
});

app.listen(4000, () => {
  console.log("server is running on 4000");
});
