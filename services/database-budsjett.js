var mysql2 = require("mysql2");

const database = mysql2.createPool({
  host: "eu-cdbr-west-01.cleardb.com",
  user: "b2634025820b95",
  database: "heroku_15cdb7f59fc730e",
  password: "581bff0c",
});

function getBudgetsByEmail(epost) {
  return database
    .promise()
    .query(
      `
    SELECT * 
        FROM budsjett
        INNER JOIN budsjett_bruker ON budsjett.ID = budsjett_bruker.budsjettID
        WHERE budsjett_bruker.epost = ?
    `,
      [epost]
    )
    .then((result) => result[0]);
}

function createRelationBudgetUser(budsjettID, epost) {
  return database.promise().query(
    `
        INSERT INTO budsjett_bruker
            (epost, budsjettID)
        VALUES 
            (?, ?)
      `,
    [epost, budsjettID]
  );
}

function createBudget(tittel, epostOwner, noNullEmailArray) {
  return database
    .promise()
    .query(
      `
        INSERT INTO budsjett
            (tittel)
        VALUES
            (?);
    `,
      [tittel]
    )
    .then((result) => {
      noNullEmailArray.forEach((epost) =>
        createRelationBudgetUser(result[0].insertId, epost)
      );
      return result[0].insertId;
    });
}

function deleteBudget(budsjettID) {
  return database.promise().query(
    `
      DELETE FROM budsjett WHERE ID = ?;
    `,
    [budsjettID]
  );
}

function updateBudget(nyTittel, budsjettID) {
  return database
    .promise()
    .query(
      `
      UPDATE budsjett 
      SET
        tittel = ?
      WHERE 
        ID = ?
    `,
      [nyTittel, budsjettID]
    )
    .then(([result]) => result[0]);
}

module.exports = {
  getBudgetsByEmail,
  createBudget,
  deleteBudget,
  updateBudget,
};
