var mysql2 = require('mysql2')

const database = mysql2.createPool({
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'b2634025820b95',
    database: 'heroku_15cdb7f59fc730e',
    password: '581bff0c'
})

function getBudgetsByEmail(epost) {
    return database.promise().query(`
    SELECT * 
        FROM budsjett
        WHERE epost = ?
    `, [epost])
      .then((result) => result[0]);
  }
  
  function createBudget(tittel, epost) {
    return database.promise().query(`
      INSERT INTO budsjett
        (tittel, epost)
      VALUES
        (?, ?)
    `, [
      tittel,
      epost
    ])
      .then(([result]) => result[0]);
  }

  function createCategory(tittel, epost, budsjett) {
    return database.promise().query(`
      INSERT INTO kategori
        (tittel, epost, budsjett)
      VALUES
        (?, ?)
    `, [
      tittel,
      epost
    ])
      .then(([result]) => result[0]);
  }

  module.exports = {
    getBudgetsByEmail,
    createBudget,
    createCategory
};