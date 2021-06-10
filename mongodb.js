const {MongoClient} = require ('mongodb');

//database parameters
const data = "ERSProject"; 
const empcoll = "employees"; 
const rmbcoll = "reimbursements"; 
const mancoll = "managers"; 

// async function postrmb() {
//     const uri = "mongodb+srv://rmb:rmbpass@testdb.rfocg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//     const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true }); 

    // try {
    //     await client.connect();
    // } catch (e) {
    //     console.error(e);
    // } finally {
    //     await client.close();
    // }
// }
// main().catch(console.error);


// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();
 
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

function createRmb(client, newRmb) { 
    const result = client.db(data).collection(rmbcoll).insertOne
    (newRmb); 

    return result; 
}

function addEmp(client, newEmp) { 
    const result = client.db(data).collection(empcoll).insertOne
    (newEmp)

    return result; 
}

function viewEmps(client) { 
    const results = client.db(data).collection(empcoll).find
    ({ title: "Employee" }).toArray()
    
    console.log(results)

    return results; 
}

function viewAllEmps(client) { 
    const results = client.db(data).collection(empcoll).find
    ({ }).toArray()
    
    console.log(results)

    return results; 
}

function clearDB(client){
    const results = client.db(data).collection(rmbcoll).deleteMany({ });
    console.log(`${results.deletedCount} documents were deleted`)
    return results;
}

function viewPending(client) { 
    const results = client.db(data).collection(rmbcoll).find
    ({ status: "pending" }).toArray()
    
    console.log(results)

    return results; 
}

function viewResolved(client) {
    
    const results = client.db(data).collection(rmbcoll).find(
        {status: {$ne: "pending"}} ).toArray()
      

    console.log(results)
    return results; 
}

function viewEmpRequests(client, employee) { 
    const results = client.db(data).collection(rmbcoll).find
    ({empname: employee}).toArray()
    console.log(results) 
    
    return results
}

function empViewPending(client, employee) { 
    const results = client.db(data).collection(rmbcoll).find({
        empname: employee, 
        status: "pending"
    }).toArray()

    console.log(results)
    return results; 
}

function empViewResolved(client, employee) {
    
    const results = client.db(data).collection(rmbcoll).find({
        status: {$ne: "pending"}, 
        empname: employee}).toArray()
      

    console.log(results)
    return results; 
}

function resolve(client, id, newStatus){
    
    const result = client.db(data).collection(rmbcoll).updateOne({
        _id: id},
        {$set: newStatus}
    );
    console.log(result)
    return result;
}






module.exports = { createRmb, 
    viewEmps,
    viewAllEmps, 
    viewPending, 
    viewResolved, 
    viewEmpRequests,
    empViewPending,
    empViewResolved,
    resolve,
    clearDB,
    addEmp }