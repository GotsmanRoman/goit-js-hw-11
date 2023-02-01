import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import cardTpl from './templates/photoCard.hbs';

const refs = {
  input: document.querySelector('.search-form__input'),
  searchBtn: document.querySelector('.search-form__btn'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

function onSearch(e) {
  e.preventDefault();

  const query = refs.input.value;
  console.log(query);
  renderFetch(query);
}

async function renderFetch(query) {
  const promise = await getPromise(query);
  console.log(promise);
  console.log(cardTpl(promise));
  refs.gallery.innerHTML = cardTpl(promise);
}

function getPromise(query) {
  const API_KEY = '33277112-6a7c7acf3741d1ff176c90aa7';

  const URL =
    'https://pixabay.com/api/?key=' +
    API_KEY +
    '&q=' +
    encodeURIComponent(query);

  return fetch(URL)
    .then(response => {
      //console.log(response);
      return response.json();
    })
    .then(data => {
      //console.log(data);
      return data;
    })
    .catch(error => {
      console.log(error);
    });
}

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

refs.searchBtn.addEventListener('click', onSearch);
