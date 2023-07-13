import i18next from "i18next";

export default (path, value, rssUrlInput, rssForm) => {
  switch(path) {
    case 'feedUrls':
    rssUrlInput.classList.remove('is-invalid');
    rssForm.reset();
    console.log(value);
    break;
    case 'error':
    rssUrlInput.classList.add('is-invalid');
    console.log(i18next.t(value));
    break;
  }
}