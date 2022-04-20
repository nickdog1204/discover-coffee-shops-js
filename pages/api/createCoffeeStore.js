const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY})
    .base(process.env.AIRTABLE_BASE_KEY);


const table = base('coffee-stores');

const createCoffeeStore = async (req, res) => {
    if (req.method === 'POST') {
        console.log({'req.body': req.body});
        const {id, name, address, voting, neighbourhood, imgUrl} = req.body;
        try {
            const records = await table
                .select({
                    filterByFormula: `id="${id}"`
                })
                .firstPage()
            res.status(200)
            const transformedRecords = records.map(it => ({...it.fields}))
            const foundRecord = transformedRecords.find(it => it.id === id);
            if (foundRecord) {
                console.log({foundRecord});
                res.json({foundRecord});
            } else {
                try {
                    const result = await table
                        .create([{
                            fields: {
                                id,
                                name,
                                address,
                                voting,
                                neighbourhood,
                                imgUrl
                            }
                        }]);
                    res.status(200);
                    console.log({result})
                    res.json({result});
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