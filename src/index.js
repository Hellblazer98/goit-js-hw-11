import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryList.style.listStyle = "none";

input.addEventListener('input', debounce(onFindCountry, DEBOUNCE_DELAY));

function onFindCountry(evt) {
    const name = evt.target.value.trim();
    if (!name) {
        clearMarkup();
        return
    }

    fetchCountries(name)
        .then(country => {
            if (country.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                clearMarkup();
                return;
            } else if (country.length >= 2 && country.length <= 10) {
                createMarkupList(country);
                countryInfo.innerHTML = '';
            } else if (country.length === 1) {
                createMarkupInfo(country);
                countryList.innerHTML = '';
            }
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
            clearMarkup();
            return error;
        });
}

function createMarkupList(countries) {
    const markup = countries.map(({ name, flags }) =>
        `<li>
            <img src='${flags.svg}' alt='${name.official}' width='30'>
            <span>${name.official}</span>
        </li>`
    )
        .join('');
    
    countryList.innerHTML = markup;
}

function createMarkupInfo(countries) {
    const markup = countries.map(({ name, capital, population, flags, languages }) =>
        `<div>
            <img src='${flags.svg}' alt='${name.official}' width='30' height='20'>
            <h1><b>${name.official}</b></h1>
        </div>
        <p>
            <span><b>Capital:</b></span>
            <span>${capital}</span
        ></p>
        <p>
            <span><b>Population:</b></span>
            <span>${population}</span
        ></p>
        <p>
            <span><b>Languages:</b></span>
            <span>${Object.values(languages).join(",")}</span
        ></p>`)
        .join('');
    
    countryInfo.innerHTML = markup;
}

function clearMarkup() {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
}

