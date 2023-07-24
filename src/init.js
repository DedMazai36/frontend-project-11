import onChange from 'on-change';
import validate from './validate.js';
import render from './render.js';
import { validateParser, showError } from './getRSS.js';

const state = {
  feedUrls: [],
  updateUrls: [],
  error: '',
  rssData: [],
  rssError: '',
  update: false,
};

const watchedState = onChange(state, (path, value) => {
  render(path, value, watchedState, state);
});

export default () => {
  const rssForm = document.querySelector('.rss');
  const rssUrlInput = document.getElementById('url-input');

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const url = data.get('url');

    // validate(url, state, rssUrlInput, rssForm);

    validate(url, watchedState.feedUrls)
      .then((value) => validateParser(value.url, watchedState))
      .catch((error) => {
        showError(error.message, watchedState)
      });

    rssUrlInput.focus();
  });
};
