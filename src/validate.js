import _ from 'lodash';

const yup = require('yup');

const isUnique = (url, feedUrls) => !_.includes(feedUrls, url);

export default (url, feedUrls) => {
  const schema = yup.object().shape({
    url: yup.string().url('UrlNotValid').test('unique', 'RSSExists', (value) => isUnique(value, feedUrls)),
  });

  const data = {
    url,
  };

  return schema.validate(data);
};

/*
export default (url, state, rssUrlInput, rssForm) => {
  const wotchedObject = onChange(state, (path, value) => {
    render(path, value, rssUrlInput, rssForm, wotchedObject, state);
  });

  const schema = yup.object().shape({
    url: yup.string().url('UrlNotValid').test('unique', 'RSSExists', (value) => isUnique(value, state)),
  });

  const data = {
    url,
  };

  schema.validate(data)
    .then((validatedData) => {
      wotchedObject.feedUrls.push(data.url);
    })
    .catch((validationError) => {
      wotchedObject.error = validationError.errors[0];
    });
};
*/
