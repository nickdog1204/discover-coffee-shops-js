import '../styles/globals.css'
import {createContext} from "react";

const StoreContext = createContext();


const StoreProvider = ({children}) => {
    const initialState = {
        latLng: '',
        coffeeStores: []
    };
    return (
        <StoreContext.Provider value={{state: initialState}}>
            {children}
        </StoreContext.Provider>
    )
}

function MyApp({Component, pageProps}) {
    return (
        <StoreProvider>
            <Component {...pageProps} />
            {/*<footer>*/}
            {/*    <p>© 2018 Gandalf</p>*/}
            {/*</footer>*/}
        </StoreProvider>
    )
}

export default MyApp
