import i18next from "i18next";
import { getNewRss, updateRss } from './getRSS.js';
import { renderRSS } from './renderRSS.js';

export default (path, value, rssUrlInput, rssForm, state, notWatchedState) => {
  const errorEl = document.getElementById('error');
  //let timerID;

  switch(path) {
    case 'feedUrls':
      rssUrlInput.classList.remove('is-invalid');
      rssForm.reset();
      //console.log(value);
      if (value.length > 0) {
        //state.update = false;
        getNewRss(value[value.length - 1], state);
      }
      break;
    case 'error':
      if (value === 'success') {
        errorEl.textContent = i18next.t('success');
        errorEl.classList.remove('text-danger');
        errorEl.classList.add('text-success');
      } else if (value === 'notRss') {
        notWatchedState.feedUrls.pop();
        errorEl.textContent = i18next.t(value);
        errorEl.classList.remove('text-success');
        errorEl.classList.add('text-danger');
        //state.update = true;
      } else if (value === 'ERR_NETWORK') {
        notWatchedState.feedUrls.pop();
        errorEl.textContent = i18next.t(value);
        errorEl.classList.remove('text-success');
        errorEl.classList.add('text-danger');
      } else {
        rssUrlInput.classList.add('is-invalid');
        errorEl.textContent = i18next.t(value);
        errorEl.classList.remove('text-success');
        errorEl.classList.add('text-danger');
      }
      break;
    case 'rssData':
      console.log(222)
      renderRSS(value);
      state.update = true;
      break;
    case 'update':
      if (value === true) {
        updateRss(state);
      }
      break;
  }
}