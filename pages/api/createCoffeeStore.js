import {findRecordsByIdFilterAsync, table} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
    if (req.method === 'POST') {
        const {id, name, address, voting, neighborhood, imgUrl} = req.body;
        try {

            const records = await findRecordsByIdFilterAsync(id)
            res.status(200)
            if (records.length !== 0) {
                // console.log({foundRecord});
                res.json({type: 'found-ok', data: records});
            } else {
                try {
                    const result = await table
                        .create([{
                            fields: {
                                id,
                                name,
                                address,
                                voting,
                                neighborhood,
                                imgUrl
                            }
                        }]);
                    res.status(200);
                    // console.log({result})
                    res.json({type: 'newlyCreated', data: result[0].fields});
                } catch (e) {
                    res.status(400);
                    res.json({errorMsg: 'Cannot create a new record'});
                }

            }
        } catch (e) {
            console.error(e)
            res.status(500)
            res.json({errorMsg: e.message})
        }
    } else {
        res.json({message: 'Needs to use POST method'})
    }

}

export default createCoffeeStore;