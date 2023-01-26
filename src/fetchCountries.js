const BASE_URL = 'https://restcountries.com/v3.1/name/';
const FIELDS = 'name,capital,population,flags,languages';

function fetchCountries(name) {
    return fetch(`${BASE_URL}${name}?fields=${FIELDS}`)
        .then(resp => {
            if (!resp.ok) {
                throw new Error(resp.statusText)
            }

            return resp.json()
        });
   
}

export { fetchCountries };