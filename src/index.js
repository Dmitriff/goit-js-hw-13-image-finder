import './main.css';
import { debounce } from 'debounce';
import Notiflix from 'notiflix';
import getApi from './js/apiService';

const imageSection = document.querySelector('.image__section');

createMarkup();

function getMoreImages(counter, list) {
  const button = document.querySelector('.more__btn');
  button.addEventListener('click', () => {
    const { url, key } = getApi();
    counter += 1;

    fetch(
      `${url}?image_type=photo&orientation=horizontal&q=${localStorage.getItem(
        'value',
      )}&page=${counter.toString()}&per_page=12&key=${key}`,
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data.hits);
        data.hits.map(photo => {
          const item = document.createElement('li');
          item.classList.add('item');

          const moreMarkup = `
                        <div class="photo-card">
                            <img src="${photo.webformatURL}" alt="" width=300/>
                            <div class="stats">
                              <p class="stats-item">
                                <i class="material-icons">thumb_up</i>
                                ${photo.likes}
                              </p>
                              <p class="stats-item">
                                <i class="material-icons">visibility</i>
                                ${photo.views}
                              </p>
                              <p class="stats-item">
                                <i class="material-icons">comment</i>
                                ${photo.comments}
                              </p>
                              <p class="stats-item">
                                <i class="material-icons">cloud_download</i>
                                ${photo.downloads}
                              </p>
                            </div>
                        </div>`;

          item.insertAdjacentHTML('beforeend', moreMarkup);
          console.log(item);

          button.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          });

          return list.appendChild(item);
        });
      });
  });
}

function createButton(buttonArea) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('more__btn');
  button.textContent = 'Load more';
  buttonArea.appendChild(button);
}

function createMarkup() {
  const form = `<form class="search-form" id="search-form">
        <input
        type="text"
        name="query"
        autocomplete="off"
        placeholder="Search images..." class="input"
        />
        </form>`;

  const formArea = document.querySelector('.input__section');

  formArea.insertAdjacentHTML('afterbegin', form);

  const buttonArea = document.createElement('div');
  imageSection.after(buttonArea);

  const list = document.createElement('ul');
  list.classList.add('list');
  imageSection.appendChild(list);

  const input = document.querySelector('input');

  input.addEventListener(
    'input',
    debounce(evt => {
      list.innerHTML = '';
      buttonArea.innerHTML = '';

      const value = evt.target.value;

      localStorage.removeItem('value');
      localStorage.setItem('value', value);

      makeImageMarkup(value, list, buttonArea);
    }, 800),
  );
}

function makeImageMarkup(value, list, buttonArea) {
  let counter = 1;

  const { url, key } = getApi();
  createButton(buttonArea);
  getMoreImages(counter, list);

  if (value === '') {
    Notiflix.Notify.info('Enter your request');
    buttonArea.innerHTML = '';
  } else {
    try {
      const returnResponse = async function () {
        return fetch(
          `${url}?image_type=photo&orientation=horizontal&q=${value}&page=1&per_page=12&key=${key}`,
        );
      };

      returnResponse()
        .then(response => {
          if (!response.status === 200) {
            throw Notiflix.Notify.failure('No server response');
          } else {
            return response.json();
          }
        })
        .then(data => {
          if (data.hits.length === 0) {
            Notiflix.Notify.failure('Nothing found');
            buttonArea.innerHTML = '';
          } else {
            Notiflix.Notify.success('Successfully');

            data.hits.map(photo => {
              const item = document.createElement('li');
              item.classList.add('item');

              const markup = `
                                <div class="photo-card">
                                    <img src="${photo.webformatURL}" alt="" width=300/>
                                    <div class="stats">
                                      <p class="stats-item">
                                        <i class="material-icons">thumb_up</i>
                                        ${photo.likes}
                                      </p>
                                      <p class="stats-item">
                                        <i class="material-icons">visibility</i>
                                        ${photo.views}
                                      </p>
                                      <p class="stats-item">
                                        <i class="material-icons">comment</i>
                                        ${photo.comments}
                                      </p>
                                      <p class="stats-item">
                                        <i class="material-icons">cloud_download</i>
                                        ${photo.downloads}
                                      </p>
                                    </div>
                                </div>`;

              item.insertAdjacentHTML('afterbegin', markup);
              return list.appendChild(item);
            });
          }
        });
    } catch (error) {
      Notiflix.Notify.failure('Нет ответа сервера');
      console.log(error);
    }

    imageSection.appendChild(list);
  }
}
