var mysql2 = require('mysql2');

const database = mysql2.createPool({
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'b2634025820b95',
    database: 'heroku_15cdb7f59fc730e',
    password: '581bff0c'
})



function lagNyBudsjettpost(tittel, sum, fast, budsjettID) {
    return database.promise().query(`
        INSERT INTO budsjettpost
            (tittel, sum, fast, budsjettID)
        VALUES 
            (?, ?, ?, ?)
    `, [
        tittel,
        sum,
        fast,
        budsjettID
    ])
}

module.exports = {
    lagNyBudsjettpost
}