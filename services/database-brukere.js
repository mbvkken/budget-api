var mysql2 = require('mysql2')

const database = mysql2.createPool({
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'b2634025820b95',
    database: 'heroku_15cdb7f59fc730e',
    password: '581bff0c'
})


async function getUsers() {
    return database.promise().query(`SELECT * FROM bruker`)
    .then(([results]) => results[0]);
}

function createUser(navn, epost, passord) {
    return database.promise().execute(`
        INSERT INTO bruker 
            (navn, epost, passord)
        VALUES
            (?, ?, ?)
    `, [
        navn,
        epost,
        passord
    ])
}

function getUserByEpost(epost) {
    return database.promise().query(`
        SELECT * 
        FROM bruker 
        WHERE epost = ?
    `, [epost])
    //  .then(([results]) => results.map(row => {return row.passord}))
    .then(([result]) => result[0]);
}

module.exports = {
    getUsers,
    createUser,
    getUserByEpost
};