var mysql2 = require('mysql2');

const database = mysql2.createPool({
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'b2634025820b95',
    database: 'heroku_15cdb7f59fc730e',
    password: '581bff0c'
})


function lagNyKategori(tittel, budsjettID) {
    return database.promise().query(`
      INSERT INTO kategori
        (tittel, budsjettID)
      VALUES
        (?, ?)
    `, [
      tittel,
      budsjettID
    ])
      .then(([result]) => result[0]);
  }

function slettKategori(kategoriID) {
    return database.promise().query(`
       DELETE FROM kategori
       WHERE ID = ?
    `, [
        kategoriID
    ])
}

function endreKategori() {
    return database.promise().query(`
        
    `)
}

module.exports = {
    lagNyKategori,
    slettKategori,
    endreKategori
}