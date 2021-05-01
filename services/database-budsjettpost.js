var mysql2 = require('mysql2');

const database = mysql2.createPool({
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'b2634025820b95',
    database: 'heroku_15cdb7f59fc730e',
    password: '581bff0c'
})



function lagNyBudsjettpost(tittel, sum, fast, kategoriID) {
    return database.promise().query(`
        INSERT INTO budsjettpost
            (tittel, sum, fast, kategoriID)
        VALUES 
            (?, ?, ?, ?)
    `, [
        tittel,
        sum,
        fast,
        kategoriID
    ])
}

function slettBudsjettpost(budsjettpostID){
    return database.promise().query(`
        DELETE FROM budsjettpost
        WHERE ID = ?
    `, [
        budsjettpostID
    ])
}

function endreBudsjettpost(tittel, sum, fast, budsjettpostID){
    return database.promise().query(`
        UPDATE budsjettpost
        SET 
            tittel = ?,
            sum = ?,
            fast = ?
        WHERE 
            ID = ?
    `, [
        tittel,
        sum, 
        fast,
        budsjettpostID
    ])
}

module.exports = {
    lagNyBudsjettpost,
    slettBudsjettpost,
    endreBudsjettpost
}