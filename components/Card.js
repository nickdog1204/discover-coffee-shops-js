import Image from 'next/image';
import Link from 'next/link';
import classes from "./Card.module.css";
import classNames from "classnames"

const Card = props => {
    return (
        <Link href={props.href}>
            <a className={classes.cardLink}>
                <div className={classNames('glass', classes.container)}>
                    <div className={classes.cardHeaderWrapper}>
                        <h2 className={classes.cardHeader}>{props.name}</h2>
                    </div>
                    <div className={classes.cardImageWrapper}>
                        <Image className={classes.cardImage} src={props.imgUrl} alt="card image" width={260}
                               height={160}/>
                    </div>
                </div>
            </a>
        </Link>
    )

}

export default Card;