const mongoose = require("mongoose");

const WatchlistSchema = new mongoose.Schema({
  username: String,
  name: String,
  price: Number,
  img: String,
});

module.exports = mongoose.model("Watchlist", WatchlistSchema);
