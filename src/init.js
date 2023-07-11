import validate from "./validate.js";

export default (state) => {
  const rssForm = document.querySelector('.rss');
  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const rssUrlInput = document.getElementById('url-input');
    const rssUrl = rssUrlInput.value.trim();

    validate(rssUrl, state, rssUrlInput, rssForm);
    rssUrlInput.focus();
  })
};
