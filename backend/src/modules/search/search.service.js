const searchRepository = require("./search.repository");

class SearchService {
  async trackQuery(queryText) {
    if (!queryText || queryText.trim() === "") return null;
    return await searchRepository.trackQuery(queryText);
  }

  async getTrendingQueries() {
    return await searchRepository.getTrending();
  }
}

module.exports = new SearchService();
