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
