import i18next from "i18next";
import getRSS from './getRSS.js';
import { renderRSS, renderError } from './renderRSS.js';

export default (path, value, rssUrlInput, rssForm, state) => {
  switch(path) {
    case 'feedUrls':
      rssUrlInput.classList.remove('is-invalid');
      rssForm.reset();
      console.log(value);
      getRSS(value[value.length - 1], state);
      break;
    case 'error':
      rssUrlInput.classList.add('is-invalid');
      console.log(i18next.t(value));
      break;
    case 'rssData':
      renderRSS(value);
      break;
    case 'rssError':
      renderError(value);
      break;
  }
}