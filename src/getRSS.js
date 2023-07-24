/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';

const getParserElement = (url) => {
  const urlProxi = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  const parser = new DOMParser();

  return axios.get(urlProxi)
    .then((response) => {
      const element = parser.parseFromString(response.data.contents, 'application/xml');
      const errorNode = element.querySelector('parsererror');
      if (errorNode) {
        return 'notRss';
      }
      return element;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') {
        return 'ERR_NETWORK';
      }
    });
};

const getParserData = (element) => {
  const list = [];
  const feedTitle = element.querySelector('title').textContent;
  const feedDescription = element.querySelector('description').textContent;
  element.querySelectorAll('item').forEach((itemEl) => {
    list.push({
      id: _.uniqueId(),
      linkTitle: itemEl.querySelector('title').textContent,
      link: itemEl.querySelector('link').textContent,
      description: itemEl.querySelector('description').textContent,
      viewed: false,
    });
  });

  return [feedTitle, feedDescription, list];
};

const loadRss = (parserElement, watchedState) => {
  const parserData = getParserData(parserElement);
  const [feedTitle, feedDescription, list] = parserData;
  watchedState.error = 'success';
  watchedState.rssData.push({
    id: _.uniqueId(),
    title: feedTitle,
    description: feedDescription,
    linkList: list,
  });
};

const showError = (errorMessage, watchedState) => {
  watchedState.error = errorMessage;
};

const validateParser = (url, watchedState) => {
  getParserElement(url)
    .then((parserElement) => {
      if (_.isString(parserElement)) {
        showError(parserElement, watchedState);
      } else {
        watchedState.feedUrls.push(url);
        watchedState.updateUrls.push(url);
        loadRss(parserElement, watchedState);
      }
    });
};

const updateRss = (state) => {
  const urls = state.updateUrls;
  if (urls.length > 0) {
    urls.map((url) => {
      getParserElement(url)
        .then((parserElement) => {
          if (_.isString(parserElement)) {
            _.remove(urls, (el) => el === url);
          } else {
            const parserData = getParserData(parserElement);
            const [feedTitle,, list] = parserData;

            list.map((post) => {
              state.rssData.map((link) => {
                if (link.title === feedTitle) {
                  if (!link.linkList.some((element) => element.linkTitle === post.linkTitle)) {
                    link.linkList.push({
                      id: _.uniqueId(),
                      linkTitle: post.linkTitle,
                      link: post.link,
                      description: post.description,
                      viewed: false,
                    });
                  }
                }
              });
            });
          }
        });
    });
  }
  console.log(state);
  setTimeout(() => {
    updateRss(state);
  }, 5000);
};

export { validateParser, showError, updateRss };
