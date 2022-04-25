const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY})
    .base(process.env.AIRTABLE_BASE_KEY);


const table = base('coffee-stores');

const getTransformedRecord = (record) => ({
    recordId: record.id,
    ...record.fields
})

const getTransformedRecords = (records) =>
    records.map(it => getTransformedRecord(it))

const findRecordsByIdFilterAsync = async (id) => {
    const foundCoffeeStoreRecords = await table
        .select({
            filterByFormula: `id="${id}"`
        })
        .firstPage();

    return getTransformedRecords(foundCoffeeStoreRecords)
}

export {table, findRecordsByIdFilterAsync, getTransformedRecords};
