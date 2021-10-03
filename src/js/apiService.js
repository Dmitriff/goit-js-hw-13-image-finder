const API_KEY = '22470352-c65ac8cc67498f5a0ef8fcd03';
const BASE_URL = 'https://pixabay.com/api';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`;

    const response = await fetch(url);
    const images = await response.json();
    const hits = await images.hits;
    this.incrementPage();
    return hits;
  }

  async fetchTotalHits() {
    const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`;

    const response = await fetch(url);
    const images = await response.json();
    const totalHits = await images.totalHits;
    return totalHits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
