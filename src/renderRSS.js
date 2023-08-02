/* eslint-disable no-use-before-define */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import i18next from 'i18next';

const renderUlFeeds = (urlData, feedElement) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
  const hEl = document.createElement('h3');
  hEl.classList.add('h6', 'm-0');
  hEl.textContent = urlData.title;
  const pEl = document.createElement('p');
  pEl.classList.add('m-0', 'small', 'text-black-50');
  pEl.textContent = urlData.description;
  liEl.appendChild(hEl);
  liEl.appendChild(pEl);

  const ulEl = feedElement.querySelector('ul');
  ulEl.appendChild(liEl);
  ulEl.insertBefore(liEl, ulEl.firstChild);
};

const renderUlPosts = (post, postElement, state) => {
  const liEl = document.createElement('li');
  liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const linkEl = document.createElement('a');
  linkEl.href = post.link;
  if (state.uiStats.viewedPosts.has(post)) {
    linkEl.className = 'fw-normal';
  } else {
    linkEl.className = 'fw-bold';
  }
  linkEl.setAttribute('data-id', post.id);
  linkEl.target = '_blank';
  linkEl.rel = 'noopener noreferrer';
  linkEl.textContent = post.linkTitle;

  const buttonEl = document.createElement('button');
  buttonEl.type = 'button';
  buttonEl.className = 'btn btn-outline-primary btn-sm';
  buttonEl.setAttribute('data-id', post.id);
  buttonEl.setAttribute('data-bs-toggle', 'modal');
  buttonEl.setAttribute('data-bs-target', '#modal');
  buttonEl.textContent = i18next.t('renderRSS.button');

  liEl.appendChild(linkEl);
  liEl.appendChild(buttonEl);

  const ulEl = postElement.querySelector('ul');
  ulEl.appendChild(liEl);
  ulEl.insertBefore(liEl, ulEl.firstChild);

  linkEl.addEventListener('click', () => {
    state.uiStats.viewedPosts.add(post);
    renderRSS(state);
  });

  buttonEl.addEventListener('click', () => {
    state.uiStats.viewedPosts.add(post);
    renderRSS(state);
  });
};

function renderRSS(state) {
  const postElement = document.querySelector('.posts');
  const feedElement = document.querySelector('.feeds');
  postElement.innerHTML = `<div class="card border-0"><div class="card-body"><h2 class="card-title h4">${i18next.t('renderRSS.posts')}</h2></div><ul class="list-group border-0 rounded-0"></ul></div>`;
  feedElement.innerHTML = `<div class="card border-0"><div class="card-body"><h2 class="card-title h4">${i18next.t('renderRSS.feeds')}</h2></div><ul class="list-group border-0 rounded-0"></ul></div>`;
  state.rssData.map((urlData) => {
    renderUlFeeds(urlData, feedElement);
    urlData.linkList.map((post) => {
      renderUlPosts(post, postElement, state);
    });
  });

  const modalEl = document.getElementById('modal');
  modalEl.addEventListener('show.bs.modal', (e) => {
    const button = e.relatedTarget;
    const id = button.getAttribute('data-id');
    state.rssData.map((link) => {
      const foundPost = link.linkList.find((obj) => obj.id === id);
      if (foundPost) {
        modalEl.querySelector('h5').textContent = foundPost.linkTitle;
        modalEl.querySelector('.btn-secondary').textContent = i18next.t('modal.closeButton');
        modalEl.querySelector('.modal-body').textContent = foundPost.description;
        modalEl.querySelector('a').href = foundPost.link;
        modalEl.querySelector('a').textContent = i18next.t('modal.linkButton');
      }
    });
  });
}

export default (state) => {
  renderRSS(state);
};
