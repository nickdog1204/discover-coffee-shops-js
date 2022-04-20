import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from "../components/Banner";
import Card from "../components/Card";
import {fetchCoffeeStoresAsync, fetchCoffeeStoresByLatLngAsync} from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import {useContext, useEffect, useState} from "react";
import {StoreContext} from "../store/store-context";
import axios from "axios";

export const getStaticProps = async (context) => {
    return {
        props: {
            coffeeStores: await fetchCoffeeStoresAsync('new york', 'coffee', '6')
        }
    }
}

export default function Home(props) {
    const {
        handleTrackLocation,
        locationErrorMsg,
        isFinding
    } = useTrackLocation();
    const {state: {latLng, coffeeStores}, dispatchSetCoffeeStores} = useContext(StoreContext);
    const [coffeeError, setCoffeeError] = useState(null);
    useEffect(() => {
        const fetchIt = async () => {
            try {
                const {data: {stores}} = await axios.get(`/api/getCoffeeStoresByLatLng?latLng=${latLng}&limit=30`)
                dispatchSetCoffeeStores(stores);
            } catch (e) {
                setCoffeeError(e.message);
            }
        }
        if (latLng) {
            fetchIt();
        }
    }, [latLng]);
    const handleBtn = () => {
        handleTrackLocation();
    }
    return (
        <div className={styles.container}>
            <Head>
                <title>咖啡鑒賞家</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <Banner btnDisabled={isFinding} btnText={isFinding ? "Loading..." : "Show stores nearby"}
                        onBtnClick={handleBtn}/>
                <div className={styles.heroImage}>
                    <Image src="/static/hero-image.png" width={700} height={400}/>
                </div>
                {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
                {coffeeError && <p>Something went wrong when fetching stores near you: {coffeeError}</p>}
                <div className={styles.sectionWrapper}>
                    {coffeeStores.length > 0 && <h2 className={styles.heading2}>Stores near me:</h2>}
                    <div className={styles.cardLayout}>
                        {coffeeStores.map(it =>
                            <Card
                                key={it.fsq_id}
                                name={it.name}
                                imgUrl={it.imgUrl || "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"}
                                href={`/coffee-store/${it.fsq_id}`}
                                className={styles.card}
                            />
                        )}

                    </div>

                </div>

                <div className={styles.sectionWrapper}>
                    {props.coffeeStores.length > 0 && <h2 className={styles.heading2}>Toronto stores</h2>}
                    <div className={styles.cardLayout}>
                        {props.coffeeStores.map(it =>
                            <Card
                                key={it.fsq_id}
                                name={it.name}
                                imgUrl={it.imgUrl || "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"}
                                href={`/coffee-store/${it.fsq_id}`}
                                className={styles.card}
                            />
                        )}

                    </div>

                </div>

            </main>

            {/*<footer className={styles.footer}>*/}
            {/*</footer>*/}
        </div>
    )
}
