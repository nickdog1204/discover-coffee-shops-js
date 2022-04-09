import {useRouter} from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import classes from "../../styles/coffee-store.module.css";
import classNames from "classnames";
import {fetchCoffeeStoresAsync} from "../../lib/coffee-stores";

export async function getStaticProps({params}) {
    const coffeeStoresData = await fetchCoffeeStoresAsync('new york', 'coffee', '6');
    const coffeeStoreById = (coffeeStoresData.find(it => it.fsq_id.toString() === params.id))
    return {
        props: {
            coffeeStore: coffeeStoreById || {location: {}}
        }
    }
}

export async function getStaticPaths() {
    console.log('11111111111111122')
    const coffeeStoresData = await fetchCoffeeStoresAsync('new york', 'coffee', '6');
    const paths = coffeeStoresData
        // .slice(0, -1)
        .map(coffeeStore => ({params: {id: coffeeStore.fsq_id.toString()}}))
    return {
        paths,
        fallback: true
    }
}

export const CoffeeStore = (props) => {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>
    }
    const {location, name, imgUrl} = props.coffeeStore;
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