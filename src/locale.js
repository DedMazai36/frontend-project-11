import i18next from 'i18next';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          'content': {
            'head': 'Hexlet Frontend Project 11',
            'urlLabel': 'Ссылка RSS',
            'buttonText': 'Добавить',
          },
          "UrlNotValid": "Ссылка должна быть валидным URL",
          "RSSExists": "RSS уже существует",
          'renderRSS': {
            'feeds': 'Фиды',
            'posts': 'Посты',
            'button': 'Просмотр',
          },
          'modal': {
            'closeButton': 'Закрыть',
            'linkButton': 'Читать полностью',
          },
        }
      }
    }
  }).then(function(t) {
    document.getElementById('title').textContent = i18next.t('content.head');
    document.getElementById('url-input-label').textContent = i18next.t('content.urlLabel');
    document.getElementById('button').textContent = i18next.t('content.buttonText');
  })
};
