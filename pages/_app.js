import '../styles/globals.css'
import StoreProvider from "../store/store-context";

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
