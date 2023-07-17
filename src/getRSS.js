import axios from 'axios';

export default (url, state) => {
  const urlProxi = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  const parser = new DOMParser();
  
  axios.get(urlProxi)
    .then(function (response) {
      const list = [];
      const element = parser.parseFromString(response.data.contents, "application/xml");
      const errorNode = element.querySelector("parsererror");
      if (errorNode) {
        state.rssError = errorNode;
      } else {
        const feedTitle = element.querySelector('title').textContent;
        const feedDescription = element.querySelector('description').textContent;
        element.querySelectorAll('item').forEach((itemEl) => {
          list.push({
            id: `${state.rssData.length}-${list.length}`,
            linkTitle: itemEl.querySelector('title').textContent,
            link: itemEl.querySelector('link').textContent,
          });
        });

        state.rssData.push({
          id: state.rssData.length,
          title: feedTitle,
          description: feedDescription,
          linkList: list,
        });
        };
    });
};
