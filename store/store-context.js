import {createContext, useReducer} from "react";

export const StoreContext = createContext();

export const STORE_ACTION_TYPES = {
    SET_LAT_LNG: 'SET_LAT_LNG',
    SET_COFFEE_STORES: 'SET_COFFEE_STORES'
}
const storeReducer = (state, action) => {
    switch (action.type) {
        case STORE_ACTION_TYPES.SET_LAT_LNG:
            return {
                ...state,
                latLng: action.payload.latLng
            }
        case STORE_ACTION_TYPES.SET_COFFEE_STORES:
            return {
                ...state,
                coffeeStores: action.payload.coffeeStores
            }
        default:
            throw new Error('Invalidddddd action type')

    }
}
const initialState = {
    latLng: '',
    coffeeStores: []
};


const StoreProvider = ({children}) => {
    const [state, dispatch] = useReducer(storeReducer, initialState);
    const dispatchSetLatlng = (latLng) => {
        dispatch({type: STORE_ACTION_TYPES.SET_LAT_LNG, payload: {latLng}})
    }
    const dispatchSetCoffeeStores = (coffeeStores) => {
        dispatch({type: STORE_ACTION_TYPES.SET_COFFEE_STORES, payload: {coffeeStores}})
    }
    return (
        <StoreContext.Provider value={{state, dispatchSetLatlng, dispatchSetCoffeeStores}}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreProvider;