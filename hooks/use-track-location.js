import {useContext, useState} from "react";
import {StoreContext} from "../store/store-context";

export const useTrackLocation = () => {
    const [locationErrorMsg, setLocationErrorMsg] = useState('');
    const ctx = useContext(StoreContext);
    const [isFinding, setIsFinding] = useState(false);
    const success = (position) => {
        const {latitude, longitude} = position.coords;

        ctx.dispatchSetLatlng(`${latitude},${longitude}`)
        setLocationErrorMsg('');
        setIsFinding(false);
    };

    const error = () => {
        setLocationErrorMsg('Unable to retrieve your location');
        setIsFinding(false);
    };

    const handleTrackLocation = () => {
        setIsFinding(true);
        if (!navigator.geolocation) {
            setLocationErrorMsg('Geolocation is not supported by your browser')
            setIsFinding(false);

        } else {
            navigator.geolocation.getCurrentPosition(success, error);

        }

    };
    return {
        locationErrorMsg,
        handleTrackLocation,
        isFinding
    };
};

export default useTrackLocation;

