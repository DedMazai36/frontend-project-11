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
    throw new Error('notRss');
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
  const list = [];
  data.item.map((itemEl) => {
    list.push({
      id: _.uniqueId(),
      linkTitle: itemEl.title,
      link: itemEl.link,
      description: itemEl.description,
    });
  });

  return [data.title, data.description, list];
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
      const [feedTitle, feedDescription, list] = data;
      watchedState.error = 'success';
      watchedState.rssData.push({
        id: _.uniqueId(),
        title: feedTitle,
        description: feedDescription,
        linkList: list,
      });
      watchedState.updateUrls.push(url);
    })
    .catch((e) => {
      if (e.code === 'ERR_NETWORK') {
        watchedState.uiStats.error = 'ERR_NETWORK';
      } else if (e.message === 'notRss') {
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
          const [feedTitle,, list] = data;
          state.rssData.map((link) => {
            if (link.title === feedTitle) {
              const difference = _.differenceBy(list, link.linkList, 'linkTitle');
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
