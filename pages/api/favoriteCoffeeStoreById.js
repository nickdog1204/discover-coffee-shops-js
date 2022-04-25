import {findRecordsByIdFilterAsync, getTransformedRecords, table} from "../../lib/airtable";

const favoriteCoffeeStoreById = async (req, res) => {

    if ('PUT' === req.method) {
        try {
            const {id} = req.body;
            if (id) {
                const records = await findRecordsByIdFilterAsync(id);
                if (0 !== records.length) {
                    const record = records[0];
                    const calculatedVoting = parseInt(record.voting) + 1;

                    const updatedRecords = await table.update([
                        {
                            id: record.recordId,
                            fields: {
                                voting: calculatedVoting
                            }
                        }
                    ]);
                    const transformedRecords = getTransformedRecords(updatedRecords)
                    console.log({transformedRecords})
                    res.json(transformedRecords);
                } else {
                    res.status(400);
                    res.json({errorMsg: `Cannot find coffee store with id: ${id}`, id});
                }

            } else {
                res.status(400);
                res.json({errorMsg: 'Id is missing'})
            }

        } catch (error) {
            res.status(500);
            res.json({message: 'Error upvoting coffee store', error});
        }

    }
}
export default favoriteCoffeeStoreById;