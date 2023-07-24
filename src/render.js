/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
import i18next from 'i18next';
import { updateRss } from './getRSS.js';
import { renderRSS } from './renderRSS.js';

export default (path, value, state, notWatchedState) => {
  const errorEl = document.getElementById('error');
  const rssForm = document.querySelector('.rss');
  const rssUrlInput = document.getElementById('url-input');

  switch (path) {
    case 'feedUrls':
      rssUrlInput.classList.remove('is-invalid');
      rssForm.reset();
      break;
    case 'error':
      if (value === 'success') {
        errorEl.textContent = i18next.t(`errors.${value}`);
        errorEl.classList.remove('text-danger');
        errorEl.classList.add('text-success');
      } else if (value === 'notRss') {
        notWatchedState.feedUrls.pop();
        errorEl.textContent = i18next.t(`errors.${value}`);
        errorEl.classList.remove('text-success');
        errorEl.classList.add('text-danger');
        // state.update = true;
      } else if (value === 'ERR_NETWORK') {
        notWatchedState.feedUrls.pop();
        errorEl.textContent = i18next.t(`errors.${value}`);
        errorEl.classList.remove('text-success');
        errorEl.classList.add('text-danger');
      } else {
        rssUrlInput.classList.add('is-invalid');
        errorEl.textContent = i18next.t(`errors.${value}`);
        errorEl.classList.remove('text-success');
        errorEl.classList.add('text-danger');
      }
      break;
    case 'rssData':
      renderRSS(value);
      state.update = true;
      break;
    case 'update':
      if (value === true) {
        updateRss(state);
      }
      break;
  }
};
