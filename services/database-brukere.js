var mysql2 = require('mysql2')

const database = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Oklahoma321',
  database: 'budgetapp'
})


async function getUsers() {
    return database.promise().query(`SELECT * FROM bruker`)
    .then((results) => results[0]);
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
    .then((results) => results.map(row => {return row.passord}))
    //.then((result) => result[0]);
}

module.exports = {
    getUsers,
    createUser,
    getUserByEpost
};