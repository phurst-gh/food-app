import axios from 'axios';
// fetch isnt used on older browsers and axios controls error handling nicely

const Search = class {
  constructor(query) {
    this.query = query;
  }

  async getResults(query) {
    //  async method returns a promise
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
      this.result = res.data.recipes;
    } catch (error) {
      alert(`Something went wrong :(`);
      console.log(error);
    }
  }
}

export default Search;