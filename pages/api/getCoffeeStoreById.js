import {findRecordsByIdFilterAsync, table} from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
    const {id} = req.query;

    console.log('getCoffeeStoreById');
    try {
        if (id) {
            const records = await findRecordsByIdFilterAsync(id)

            if (records.length !== 0) {
                res.json(records);
            } else {
                res.json({message: 'id could not be found'})
            }
        } else {
            res.status(400);
            res.json({errMsg: 'id is missing'});
        }

    } catch (error) {
        res.status(500);
        res.json({errorMsg: 'Something went wrong', error});
    }

}

export default getCoffeeStoreById;