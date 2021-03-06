'use strict';

(function () {
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_URL = 'https://js.dump.academy/keksobooking/';
  var REQUEST_TIMEOUT = 10000;
  var OK_CODE = 200;
  var main = document.querySelector('main');
  var errorAd = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
  var errorCloseBtn = errorAd.querySelector('.error__button');

  // обрабатываем ошибки
  var getErrorMessage = function (status) {
    var errorMessage;
    switch (status) {
      case 400:
        errorMessage = 'Неверный запрос';
        break;
      case 401:
        errorMessage = 'Пользователь не авторизован';
        break;
      case 404:
        errorMessage = 'Данные не найдены';
        break;
      default:
        errorMessage = 'Ошибка доступа: ' + status;
    }
    return errorMessage;
  };

  // отрисовка сообщения об ошибке и закрытие окна с ошибкой
  var onError = function () {
    var onErrorEscKeyDown = function (evt) {
      evt.preventDefault();
      if (evt.keyCode === window.utils.esc) {
        main.removeChild(errorAd);
        window.utils.setActiveState();
        document.removeEventListener('keydown', onErrorEscKeyDown);
      }
    };

    main.appendChild(errorAd);
    errorAd.querySelector('.error__message').textContent = getErrorMessage();
    document.addEventListener('keydown', onErrorEscKeyDown);

    errorCloseBtn.addEventListener('click', function () {
      main.removeChild(errorAd);
      window.utils.setActiveState();
      document.removeEventListener('keydown', onErrorEscKeyDown);
    });
  };

  // функция загрузки данных с сервера и на сервер
  var sendRequest = function (onSuccess, method, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === OK_CODE) {
        onSuccess(xhr.response);
      } else {
        onError(getErrorMessage(xhr.status));
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + REQUEST_TIMEOUT + 'мс');
    });

    xhr.open(method, (method === 'GET') ? GET_URL : POST_URL);
    xhr.send(data);
  };

  window.backend = {
    save: function (onSuccess, method, data) {
      sendRequest(onSuccess, method, data);
    },
    load: function (onSuccess, method) {
      sendRequest(onSuccess, method);
    },
    main: main
  };
})();
