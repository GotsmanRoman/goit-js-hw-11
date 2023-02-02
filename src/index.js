//------------------Імпорт пакетів/стилі/шаблонів
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import cardTpl from './templates/photoCard.hbs';
import axios from 'axios';
//------------------Імпорт пакетів/стилі/шаблонів

//------------------Змінні
const refs = {
  input: document.querySelector('.search-form__input'),
  searchBtn: document.querySelector('.search-form__btn'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let searchPage = 1;
let searchResultQuantity = 0;
let query = '';
let gallery;
//------------------Змінні

//------------------Ініціалізація Галереї
function callSimpleLightBox() {
  gallery = new SimpleLightbox('.gallery a', {
    caption: 'true',
    captionType: 'attr',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
  gallery.on('show.simplelightbox', function (e) {
    // Do something…
  });

  gallery.on('error.simplelightbox', function (e) {
    console.log('Помилка загрузки галереї'); // Some usefull information
  });
}
//------------------Галерея

//------------------Cповіщення
Notiflix.Notify.init({
  width: '280px',
  position: 'center-top', // 'right-top' - 'right-bottom' - 'left-top' - 'left-bottom' - 'center-top' - 'center-bottom' - 'center-center'
  distance: '100px',
  clickToClose: true,
});
function showNotify(valueToFade = '2000') {
  Notiflix.Notify.info(
    `We're sorry, but you've reached the end of search results.`,
    {
      timeout: valueToFade,
    }
  );
}
function showError(valueToFade = '2000') {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      timeout: valueToFade,
    }
  );
}
function showSuccess(totalHits, valueToFade = '2000') {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`, {
    timeout: valueToFade,
  });
}
//------------------Cповіщення

async function onSearch(e) {
  e.preventDefault();
  refs.loadMoreBtn.classList.add('is-hidden');
  searchPage = 1;
  query = refs.input.value;
  clearGallery();

  try {
    if (await renderFetch(query)) {
      showSuccess(searchResultQuantity);
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch {
    showError();
  }
}
function onLoadMore(e) {
  e.preventDefault();
  searchPage++;
  renderFetch();
}
function isResponseOk(response) {
  if (response.status !== 200) {
    throw new Error(response.status);
  } else if (response.data.total === 0) {
    showError();
    return;
  }
  searchResultQuantity = response.data.totalHits;
  return response.data;
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function renderFetch() {
  const promise = await getPromise();
  refs.gallery.insertAdjacentHTML('beforeend', cardTpl(promise));
  if (!gallery) {
    callSimpleLightBox();
  } else {
    gallery.refresh();
  }
  return promise;
}

async function getPromise() {
  try {
    const response = await axios.get('https://pixabay.com/api/?', {
      params: {
        key: '33277112-6a7c7acf3741d1ff176c90aa7',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: searchPage,
      },
    });
    const responseParsed = await isResponseOk(response);
    return responseParsed;
  } catch {
    console.log(error);
    showNotify();
  }
}

refs.searchBtn.addEventListener('click', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
