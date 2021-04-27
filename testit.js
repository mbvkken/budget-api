const mysql = require('mysql2');
 
// create the connection to database
const connection = mysql.createConnection({
  host: 'eu-cdbr-west-01.cleardb.com',
  user: 'b2634025820b95',
  database: 'heroku_15cdb7f59fc730e',
  password: '581bff0c',
});
 

 
// with placeholder
// connection.query(
//   'SELECT * FROM `book` WHERE `ID` = ?',
//   [15],
//   function(err, results) {
//     console.log(results[0].ID);
//   }
// );
//------------------------------------------------------

// connection.promise().query( 'SELECT * FROM `book` WHERE `ID` = ?', [15])
//   .then( ([rows]) => {
//     console.log(rows);
//   })
 



