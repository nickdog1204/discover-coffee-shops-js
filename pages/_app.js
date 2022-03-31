import '../styles/globals.css'

function MyApp({Component, pageProps}) {
    return (
        <div>
            <Component {...pageProps} />
            {/*<footer>*/}
            {/*    <p>© 2018 Gandalf</p>*/}
            {/*</footer>*/}
        </div>
    )
}

export default MyApp
