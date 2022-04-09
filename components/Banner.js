import classes from "./Banner.module.css";
import classNames from "classnames";


const Banner = (props) => {
    const {btnText, onBtnClick, btnDisabled} = props;
    const handleClick = (event) => {
        if (!btnDisabled) {
            onBtnClick(event)
        }
    }
    return (
        <div className={classes.container}>
            <h1 className={classes.title}>
                <span className={classes.title1}>咖啡</span>
                <span className={classes.title2}>Connoisseur</span>
            </h1>
            <p className={classes.subTitle}>Explore local coffee shops</p>
            <div className={classes.buttonWrapper}>
                <button className={classNames(classes.button, {[classes.disabled]: btnDisabled})}
                        onClick={handleClick}>{btnText}</button>
            </div>
        </div>
    )
}
export default Banner;