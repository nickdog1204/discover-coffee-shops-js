import {fetchCoffeeStoresByLatLngAsync} from "../../lib/coffee-stores";

const handler = async (req, res) => {
    const {latLng, limit} = req.query;
    try {
        const stores = await fetchCoffeeStoresByLatLngAsync(latLng, null, limit);
        res.status(200).json({stores})
    } catch (e) {
        res.status(500).json({errMsg: 'Some Error!'})
    }
}
export default handler;