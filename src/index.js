import ApiService from './js/apiService.js';
import createImageCard from './templates/gallery-items.hbs';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/countdown/dist/PNotifyCountdown.css';
import { alert } from '@pnotify/core';
import notificationOptions from './js/notificationSettings.js';
import * as basicLightbox from 'basiclightbox';
import { debounce } from 'debounce';
import { throttle } from 'throttle-debounce';
console.log(throttle);
const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  body: document.querySelector('body'),
  anchor: document.querySelector('.anchor'),
  input: document.querySelector('.search-form__input'),
};

const apiService = new ApiService();
const observer = new IntersectionObserver(throttle(500, true, observerCallback), {
  threshold: 0,
});

refs.input.addEventListener('input', debounce(onSearch, 500));
refs.gallery.addEventListener('click', onMakeBigImage);
window.addEventListener('scroll', onAddObserver);
function observerCallback() {
  onLoadMore();
}
function onAddObserver() {
  observer.observe(refs.anchor);
}
async function onSearch(e) {
  e.preventDefault();
  if (e.target.nodeName === 'INPUT') {
    apiService.query = e.target.value.trim();
  }
  if (apiService.query === '') {
    helpFoundInput(e);
    return alert(notificationOptions.notMachResults);
  }

  apiService.resetPage();
  clearGallery();
  const response = await fetchImages();

  if (response.totalHits === 0) {
    return alert(notificationOptions.incorrectQuery);
  }
  if (response.totalHits > 0) {
    (notificationOptions.successResult.title = `Found ${response.totalHits} ${apiService.query} images`),
      alert(notificationOptions.successResult);
  }
}
async function fetchImages() {
  if (apiService.query === '') {
    return;
  }
  const response = await apiService.fetchImages();
  const array = await response.json();
  await createGallery(array.hits);
  return array;
}
function createGallery(images) {
  refs.gallery.insertAdjacentHTML('beforeend', createImageCard(images));
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
function onLoadMore(totalHits) {
  fetchImages();
  if (refs.gallery.children.length >= totalHits) {
    observer.unobserve(refs.anchor);
    alert(notificationOptions.imagesAreOver);
  }
}
function onMakeBigImage(e) {
  if (e.target.className !== 'photo-image') {
    return;
  }
  const largeImagePath = e.target.dataset.large_img;
  const instance = basicLightbox.create(`<img src="${largeImagePath}">`);
  instance.show();
}
function helpFoundInput(e) {
  console.log(refs.anchor.classList);
  e.target.value = '';
  refs.anchor.classList.toggle('pro');
  setTimeout(() => {
    refs.anchor.classList.toggle('pro');
  }, 5000);
}
