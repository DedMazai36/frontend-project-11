/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';

const parse = (contents) => {
  const parser = new DOMParser();
  const element = parser.parseFromString(contents, 'application/xml');
  const errorNode = element.querySelector('parsererror');
  if (errorNode) {
    const e = new Error('The resource does not contain valid RSS');
    e.isParsingError = true;
    throw e;
  }
  const item = [];
  const title = element.querySelector('title').textContent;
  const description = element.querySelector('description').textContent;
  element.querySelectorAll('item').forEach((itemEl) => {
    item.push({
      title: itemEl.querySelector('title').textContent,
      link: itemEl.querySelector('link').textContent,
      description: itemEl.querySelector('description').textContent,
    });
  });
  return {
    title,
    description,
    item,
  };
};

const changingData = (data) => {
  const items = [];
  data.item.map((itemEl) => {
    items.push({
      id: _.uniqueId(),
      linkTitle: itemEl.title,
      link: itemEl.link,
      description: itemEl.description,
    });
  });

  return {
    title: data.title,
    description: data.description,
    items,
  };
};

const getParserData = (url) => {
  const urlProxi = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

  return axios.get(urlProxi)
    .then((response) => {
      const data = parse(response.data.contents);
      return changingData(data);
    });
};

const loadRss = (url, watchedState) => {
  getParserData(url)
    .then((data) => {
      watchedState.feedUrls.push(url);
      watchedState.uiStats.error = 'success';
      watchedState.rssData.push({
        id: _.uniqueId(),
        title: data.title,
        description: data.description,
        linkList: data.items,
      });
      watchedState.updateUrls.push(url);
    })
    .catch((e) => {
      if (e.isAxiosError) {
        watchedState.uiStats.error = 'ERR_NETWORK';
      } else if (e.isParsingError === true) {
        watchedState.uiStats.error = 'notRss';
      } else {
        watchedState.uiStats.error = 'unknown';
      }
    });
};

const showError = (errorMessage, watchedState) => {
  watchedState.uiStats.error = errorMessage;
};

const updateRss = (state) => {
  const urls = state.updateUrls;
  if (urls.length > 0) {
    urls.map((url) => {
      getParserData(url)
        .then((data) => {
          state.rssData.map((link) => {
            if (link.title === data.title) {
              const difference = _.differenceBy(data.items, link.linkList, 'linkTitle');
              if (difference.length > 0) {
                link.linkList = _.concat(link.linkList, difference);
              }
            }
          });
        })
        .catch(() => {
          _.remove(urls, (el) => el === url);
        });
    });
  }

  setTimeout(() => {
    updateRss(state);
  }, 5000);
};

export { loadRss, showError, updateRss };
