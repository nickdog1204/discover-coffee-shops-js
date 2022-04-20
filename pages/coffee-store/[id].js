import {useRouter} from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import classes from "../../styles/coffee-store.module.css";
import classNames from "classnames";
import {fetchCoffeeStoresAsync} from "../../lib/coffee-stores";
import {useContext, useEffect, useState} from "react";
import {StoreContext} from "../../store/store-context";
import axios from "axios";

export async function getStaticProps({params}) {
    const coffeeStoresData = await fetchCoffeeStoresAsync('new york', 'coffee', '6');
    const coffeeStoreById = (coffeeStoresData.find(it => it.fsq_id.toString() === params.id))
    console.log({coffeeStoreById})
    return {
        props: {
            coffeeStore: coffeeStoreById || {location: {}}
        }
    }
}

export async function getStaticPaths() {
    const coffeeStoresData = await fetchCoffeeStoresAsync('new york', 'coffee', '6');
    const paths = coffeeStoresData
        // .slice(0, -1)
        .map(coffeeStore => ({params: {id: coffeeStore.fsq_id.toString()}}))
    return {
        paths,
        fallback: true
    }
}

export const CoffeeStore = (initialProps) => {
    const router = useRouter();
    console.log('initialProps.coffeeStore', initialProps.coffeeStore);
    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
    const {state: {coffeeStores}} = useContext(StoreContext);
    const idStr = router.query.id;
    const handleCreateCoffeeStoreAsync = async (coffeeStore) => {
        const {
            fsq_id,
            name,
            location: {
                address, neighborhood: neighbourhood
            },
            imgUrl
        } = coffeeStore;
        const myNeighbourhood = neighbourhood && neighbourhood.length > 0 ? neighbourhood[0] : neighbourhood ? neighbourhood : '<<沒有沒有>>';
        const {data} = await axios.post('/api/createCoffeeStore', {
            id: `${fsq_id}`,
            name,
            address: address || '<沒有地址資訊>',
            neighbourhood: myNeighbourhood,
            voting: 0,
            imgUrl
        })
    }
    useEffect(() => {
        if (!coffeeStore?.fsq_id) {
            const coffeeStoreFromContext = coffeeStores.find(it => it.fsq_id === idStr)
            if (coffeeStoreFromContext) {
                setCoffeeStore(coffeeStoreFromContext);
                handleCreateCoffeeStoreAsync(coffeeStoreFromContext)
            }
        } else {
            console.log({'initialProps.coffeeStore111': initialProps.coffeeStore});
            handleCreateCoffeeStoreAsync(initialProps.coffeeStore)
        }
    }, [idStr, initialProps, initialProps.coffeeStore]);

    if (router.isFallback) {
        console.log('fallback');
        return <div>Loading...</div>
    }
    if (coffeeStore) {
    }
    const {location, name, imgUrl} = coffeeStore;

    // console.log('CoffeeStore props:', props);

    const upvoteBtnHandler = () => {
        console.log('handle upvote')
    }

    return (
        <div className={classes.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={classes.container}>
                <div className={classes.col1}>
                    <div className={classes.backToHomeLink}>
                        <Link href="/"><a>回到首頁</a></Link>
                    </div>
                    <div className={classes.nameWrapper}>
                        <h1 className={classes.name}>{name}</h1>
                    </div>
                    <Image
                        src={imgUrl || 'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'}
                        width={600} height={360} alt={name} className={classes.storeImg}/>
                </div>
                <div className={classNames('glass', classes.col2)}>
                    <div className={classes.iconWrapper}>
                        <Image src="/static/icons/places.svg" width="24" height="24"/>
                        <p className={classes.text}>{location.formatted_address}</p>
                    </div>
                    {location.neighborhood && <div className={classes.iconWrapper}>
                        <Image src="/static/icons/nearMe.svg" width="24" height="24"/>
                        <p className={classes.text}>{location.neighborhood[0]}</p>
                    </div>}
                    <div className={classes.iconWrapper}>
                        <Image src="/static/icons/star.svg" width="24" height="24"/>
                        <p className={classes.text}>1</p>
                    </div>
                    <button className={classes.upvoteButton}
                            onClick={upvoteBtnHandler}>
                        Up vote!
                    </button>
                </div>

            </div>

        </div>

    )
}

export default CoffeeStore