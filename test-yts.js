import { fetchMovies } from './src/services/ytsApi.js';
// We need to mock window.location.origin since it's used in ytsApi.ts?
// Wait, we removed window.location.origin in ytsApi.ts!
