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
import {isEmpty} from "../../lib/utils";
import useSWR from 'swr';

export async function getStaticProps({params}) {
    const coffeeStoresData = await fetchCoffeeStoresAsync('new york', 'coffee', '6');
    const coffeeStoreById = (coffeeStoresData.find(it => it.id.toString() === params.id))
    return {
        props: {
            coffeeStore: coffeeStoreById || {}
        }
    }
}

export async function getStaticPaths() {
    const coffeeStoresData = await fetchCoffeeStoresAsync('new york', 'coffee', '6');
    const paths = coffeeStoresData
        // .slice(0, -1)
        .map(coffeeStore => ({params: {id: coffeeStore.id.toString()}}))
    return {
        paths,
        fallback: true
    }
}

export const CoffeeStore = (initialProps) => {
    const router = useRouter();
    const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
    const {state: {coffeeStores}} = useContext(StoreContext);
    const [votingCount, setVotingCount] = useState(1);
    const idStr = router.query.id;
    const {data, error} = useSWR(`/api/getCoffeeStoreById?id=${idStr}`, (url) => axios(url).then(it => it.data));
    useEffect(() => {
        if (data && data.length > 0) {
            setCoffeeStore(data[0]);
            setVotingCount(data[0].voting);
        }
    }, [data])
    const handleCreateCoffeeStoreAsync = async (coffeeStore) => {
        try {
            const {data} = await axios.post('/api/createCoffeeStore', {
                ...coffeeStore,
                voting: 0
            });
            return data;
        } catch (e) {
            console.error('Error creating coffee store', e)
        }
    }
    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length > 0) {
                const coffeeStoreFromContext = coffeeStores.find(it => it.id === idStr)
                if (coffeeStoreFromContext) {
                    setCoffeeStore(coffeeStoreFromContext);
                    handleCreateCoffeeStoreAsync(coffeeStoreFromContext)
                        // .then(res => console.log({res}))
                }
            } else {
                // handleCreateCoffeeStoreAsync({id: idStr})
                //     .then(({type, data}) => {
                //         console.log({type})
                //         setCoffeeStore(data);
                //     })
            }
        } else {
            handleCreateCoffeeStoreAsync(initialProps.coffeeStore)
                // .then(res => console.log({res}))
        }
    }, [idStr, initialProps, initialProps.coffeeStore]);
    if (error) {
        return (
            <div>取得咖啡廳資料時出錯了</div>
        )
    }


    if (router.isFallback) {
        // console.log('fallback');
        return <div>Loading...</div>
    }
    if (coffeeStore) {
    }
    // console.log({'myCOFFFEEStore': coffeeStore});
    const {address, neighborhood, name, imgUrl} = coffeeStore || {};

    // console.log('CoffeeStore props:', props);


    const upvoteBtnHandler = async () => {
        const {data} = await axios.put(`/api/favoriteCoffeeStoreById`, {
            id: idStr
        });
        if (0 !== data.length) {
            setVotingCount(data[0].voting);
        }
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
                        <p className={classes.text}>{address}</p>
                    </div>
                    <div className={classes.iconWrapper}>
                        <Image src="/static/icons/nearMe.svg" width="24" height="24"/>
                        <p className={classes.text}>{neighborhood}</p>
                    </div>
                    <div className={classes.iconWrapper}>
                        <Image src="/static/icons/star.svg" width="24" height="24"/>
                        <p className={classes.text}>{votingCount}</p>
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