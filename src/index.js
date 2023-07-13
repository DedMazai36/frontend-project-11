import  './styles.scss';
import  'bootstrap';
import init from './init.js';
import locale from './locale.js';

const state = {
  feedUrls: [],
  error: '',
}

locale();

init(state);