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
            'mainHead': 'RSS агрегатор',
            'secondHead': 'Начните читать RSS сегодня! Это легко, это красиво.',
            'example': 'Пример: https://ru.hexlet.io/lessons.rss',
          },
          "UrlNotValid": "Ссылка должна быть валидным URL",
          "RSSExists": "RSS уже существует",
          'success': 'RSS успешно загружен',
          'notRss': 'Ресурс не содержит валидный RSS',
          'ERR_NETWORK': 'Ошибка сети',
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
    document.getElementById('url-button').textContent = i18next.t('content.buttonText');
    document.getElementById('main-head').textContent = i18next.t('content.mainHead');
    document.getElementById('second-head').textContent = i18next.t('content.secondHead');
    document.getElementById('url-input').placeholder = i18next.t('content.urlLabel');
    document.getElementById('example').textContent = i18next.t('content.example');
  })
};
