const {MongoClient} = require ('mongodb');

//database parameters
const data = "ERSProject"; 
const empcoll = "employees"; 
const rmbcoll = "reimbursements"; 
const mancoll = "managers"; 

async function main() {
    const uri = "mongodb+srv://rmb:rmbpass@testdb.rfocg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true }); 

    try {
        await client.connect();
    
        //await listDatabases(client);
        await createRmb(client, {
            amount: 500, 
            reason: 'I need money please', 
            status: 'pending', 
            comment: ''
        })

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error);


async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createRmb(client, newRmb) { 
    const result = await client.db(data).collection(rmbcoll).insertOne
    (newRmb); 

    console.log(`New rmb id: ${result.insertedId}`);
}

module.exports = { createRmb }