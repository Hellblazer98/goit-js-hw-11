import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchPixabayApi } from './fetch';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-form-input');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

const lightboxOptions = {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
}

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
}

let page = 0;
let perPage = 40;
let searchQuery = input.value;

let gallerySimpleLightbox = new SimpleLightbox('.gallery a', lightboxOptions);
let observer = new IntersectionObserver(onLoad, options);

async function onLoad(entries, observer) {
    entries.forEach(async entry => {
        const data = await fetchPixabayApi(searchQuery, page, perPage);
        const totalPages = data.totalHits / perPage;
        if (entry.isIntersecting) {
            searchQuery = input.value.trim();
            page += 1;
            createGalleryMarkup(data.hits)
        }

        if (page >= totalPages) {
                observer.unobserve(guard);
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            }
    });
}


form.addEventListener('submit', onFetchGallery);

function onFetchGallery(evt) {
    evt.preventDefault();
    searchQuery = input.value.trim();
    page = 1;


    if (!searchQuery) {
        clearMarkup();
        return
    }

    fetchPixabayApi(searchQuery, page, perPage)
        .then(data => {
            if (data.hits.length === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                clearMarkup();
                return
            } else {
                clearMarkup();
                createGalleryMarkup(data.hits);
                observer.observe(guard);
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
                gallerySimpleLightbox.refresh();


                const { height: cardHeight } = document
                    .querySelector(".gallery")
                    .firstElementChild.getBoundingClientRect();

                    window.scrollBy({
                    top: cardHeight * -1,
                    behavior: "smooth",
                    });
            }

            
        })
        .catch(err => console.log(err));
}

function createGalleryMarkup(images) {
    const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
            <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b><span class="info_item-api">${likes}</span>
                </p>
                <p class="info-item">
                    <b>Views</b><span class="info_item-api">${views}</span>
                </p>
                <p class="info-item">
                    <b>Comments</b><span class="info_item-api">${comments}</span>
                </p>
                <p class="info-item">
                    <b>Downloads</b><span class="info_item-api">${downloads}</span>
                </p>
            </div>
        </div>`
        ).join('');
    
    gallery.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
    gallery.innerHTML = '';

}







