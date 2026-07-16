const Search = require("./search.model");

class SearchRepository {
  async trackQuery(queryText) {
    return await Search.findOneAndUpdate(
      { query: queryText.toLowerCase().trim() },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  }

  async getTrending() {
    return await Search.find().sort({ count: -1 }).limit(10);
  }
}

module.exports = new SearchRepository();
