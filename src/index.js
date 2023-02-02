import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import cardTpl from './templates/photoCard.hbs';

//------------------Змінні
const refs = {
  input: document.querySelector('.search-form__input'),
  searchBtn: document.querySelector('.search-form__btn'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let searchPage = 1;
let canSearchMore = true;
let totalHits = 0;
//------------------Змінні

//------------------Галерея
function callSimpleLightBox() {
  let gallery = new SimpleLightbox('.gallery a', {
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
    console.log(e); // Some usefull information
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
  clearGallery();
  searchPage = 1;

  query = refs.input.value;

  await renderFetch(query);
  console.log(totalHits);
  refs.loadMoreBtn.classList.remove('is-hidden');
}
function onLoadMore(e) {
  e.preventDefault();

  // if (allowToSearch()) return;

  // console.log(searchPage);
  renderFetch(query);
  searchPage++;
}
// function allowToSearch() {
//   if (!canSearchMore) {
//     showNotify();
//     return;
//   }
//   if (searchPage * 40 > 500) canSearchMore = false;
// }
function isResponseOk(response) {
  if (response.status !== 200) {
    throw new Error(response.status);
  }
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function renderFetch(query) {
  const promise = await getPromise(query);
  refs.gallery.insertAdjacentHTML('beforeend', cardTpl(promise));
  callSimpleLightBox();
}

function getPromise(query) {
  const BASIC_URL = 'https://pixabay.com/api/?key=';
  const API_KEY = '33277112-6a7c7acf3741d1ff176c90aa7';
  const IMAGE_TYPE = 'image_type=photo';
  const IMAGE_ORIENTATION = 'orientation=horizontal';
  const SAFE_SEARCH = 'safesearch=true';
  const PER_PAGE = 'per_page=40';
  let page = `page=${searchPage}`;

  const SEARCH_OPTIONS = [
    IMAGE_TYPE,
    IMAGE_ORIENTATION,
    SAFE_SEARCH,
    PER_PAGE,
    page,
  ];

  const URL = `${BASIC_URL}${API_KEY}&q=${query}&${SEARCH_OPTIONS.join('&')}`;
  console.log(URL);

  return fetch(URL)
    .then(response => {
      isResponseOk(response);
      return response.json();
    })
    .then(data => {
      if (data.total === 0) {
        showError();
        return;
      }
      //console.log(data);
      totalHits = data.totalHits;
      return data;
    })
    .catch(error => {
      //console.log(error);
      showNotify();
    });
}

// // const { height: cardHeight } = document
// //   .querySelector('.gallery')
// //   .firstElementChild.getBoundingClientRect();

// // window.scrollBy({
// //   top: cardHeight * 2,
// //   behavior: 'smooth',
// // });

refs.searchBtn.addEventListener('click', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
