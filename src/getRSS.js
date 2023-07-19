import axios from 'axios';
import _ from 'lodash';

const getParserData = (url, state) => {
  const urlProxi = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  const parser = new DOMParser();

  return axios.get(urlProxi)
    .then(function (response) {
      const list = [];
      const element = parser.parseFromString(response.data.contents, "application/xml");
      const errorNode = element.querySelector("parsererror");
      if (errorNode) {
        state.rssError = errorNode;
        return null;
      } else {
        const feedTitle = element.querySelector('title').textContent;
        const feedDescription = element.querySelector('description').textContent;
        element.querySelectorAll('item').forEach((itemEl) => {
          list.push({
            id: `${state.rssData.length}-${list.length}`,
            linkTitle: itemEl.querySelector('title').textContent,
            link: itemEl.querySelector('link').textContent,
            description: itemEl.querySelector('description').textContent,
            viewed: false,
          });
        });
        return [feedTitle, feedDescription, list];
      };
    });
};

export const getNewRss = (url, state) => {
  getParserData(url, state)
    .then((data) => {
      if (data !== null) {
        const [feedTitle, feedDescription, list] = data;
        state.rssData.push({
          id: state.rssData.length,
          title: feedTitle,
          description: feedDescription,
          linkList: list,
        });
      }
    })
};

export const updateRss = (state) => {
  state.feedUrls.map((url) => {
    getParserData(url, state)
      .then((data) => {
        if (data !== null) {
        const [feedTitle, feedDescription, list] = data;
        list.map((post) => {
          let i = 0;
          state.rssData.map((link) => {
            if (!link.linkList.some((element) => element.linkTitle === post.linkTitle)) {
              link.linkList.push({
                id: `${i}-${link.linkList.length}`,
                linkTitle: post.linkTitle,
                link: post.link,
                description: post.description,
                viewed: false,
              });
            }
            i += 1;
          });
        });
        }
      });
  });

  setTimeout(() => {
    updateRss(state);
  }, 5000);
};
