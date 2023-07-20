import _ from 'lodash';
import onChange from 'on-change';
import render from './render.js';

const yup = require('yup');

const isUnique = (url, state) => {
  return !_.includes(state.feedUrls, url);
}

export default (url, state, rssUrlInput, rssForm) => {
  const wotchedObject = onChange(state, (path, value) => {
    render(path, value, rssUrlInput, rssForm, wotchedObject, state);
  })

  const schema = yup.object().shape({
    url: yup.string().url('UrlNotValid').test('unique', 'RSSExists', (value) => {
      return isUnique(value, state);
    })
  });

  const data = {
    url,
  };

  schema.validate(data)
    .then(validatedData => {
        wotchedObject.feedUrls.push(data.url);
    })
    .catch(validationError => {
      wotchedObject.error = validationError.errors[0];
    })
};
