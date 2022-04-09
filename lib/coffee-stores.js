import axios from "axios";
import {createApi} from "unsplash-js";

const unsplashApi = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
})

const getListOfCoffeeStorePhotosAsync = async (numOfPage = 10) => {
    const res = await unsplashApi.search.getPhotos({
        query: 'coffee store',
        page: 1,
        perPage: numOfPage,
        // color: 'green',
        // orientation: 'portrait',
    });
    const {results} = res.response;
    return results.map(it => it.urls.small)
}

export const fetchCoffeeStoresAsync = async (near, query, limit) => {
    const listOfPhotos = await getListOfCoffeeStorePhotosAsync();
    const {data} = await axios.get('https://api.foursquare.com/v3/places/search', {
        params: {
            near,
            query,
            limit
        },
        headers: {
            'Authorization': process.env.NEXT_PUBLIC_FOURSQUARE_ACCESS_TOKEN,
        }
    })
    return data.results.map((it, idx) => ({
        ...it,
        imgUrl: listOfPhotos[idx]
    }));
}
export const fetchCoffeeStoresByLatLngAsync = async (ll, query, limit) => {
    const listOfPhotos = await getListOfCoffeeStorePhotosAsync(Number(limit));
    const {data} = await axios.get('https://api.foursquare.com/v3/places/search', {
        params: {
            ll,
            query,
            limit
        },
        headers: {
            'Authorization': process.env.NEXT_PUBLIC_FOURSQUARE_ACCESS_TOKEN,
        }
    })
    return data.results.map((it, idx) => ({
        ...it,
        imgUrl: listOfPhotos[idx]
    }));
}
