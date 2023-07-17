import  './styles.scss';
import  'bootstrap';
import init from './init.js';
import locale from './locale.js';

const state = {
  feedUrls: [],
  error: '',
  rssData: [],
  rssError: '',
}

locale();

init(state);
