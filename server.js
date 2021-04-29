const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { authenticate } = require('./middleware');
const { 
    getUsers,
    createUser,
    getUserByEpost
 } = require('./services/database-brukere');
 const { 
    getBudgetsByEmail,
    createBudget,
    createCategory
 } = require('./services/database-budsjett');
const port = process.env.PORT || '3001';
const secret = 'somethingverysecret1234'

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/bruker', async (req, res, next) => {
    try {
        const brukere = await getUsers();
        res.send(brukere);
    } catch (err) {
        next(err);
    }  
});

app.post('/registrer', async (req, res) => {
    const { navn, epost, passord } = req.body;

    try {
        const passordHash = await bcrypt.hash(passord, 10);

        const bruker = await createUser(navn, epost, passordHash);

        const token = jwt.sign({
            ID: bruker.ID,
            navn: bruker.navn,
            epost: bruker.epost
        }, Buffer.from(secret, 'base64'));

        res.send({
            token: token
        });
    } catch (error) {
        res.send(error.message);
    }
})

app.post('/session', async (req, res) => {
    const { epost, passord } = req.body;

    try {
        const bruker = await getUserByEpost(epost);
        if(!bruker) {
            return res.status(401).send({ error: 'ukjent bruker' });
        }

        const isCorrectPassword = await bcrypt.compare(passord, bruker.passord);

        if (!isCorrectPassword) {
            return res.status(401).send({ error: 'feil passord' });
        }

        const token = jwt.sign({
            ID: bruker.ID,
            epost: bruker.epost,
            navn: bruker.navn,
        }, Buffer.from(secret, 'base64'));

        res.send({
            token: token
        })

    } catch(error) {
        res.status(500).send({error: error.message});
    }
});

app.get('/session', authenticate, (req, res) => {
    const { epost } = req.body;

    res.send({
        message: `Du er innlogget som ${epost}.`
    })
   
})

app.get('/budsjett/:epost', async (req, res) => {
    const { epost } = req.params;
    const budsjetter = await getBudgetsByEmail(epost);
    res.send(budsjetter);
  });

  app.post('/budsjett', async (req, res) => {
    const { tittel, epost } = req.body;
    const newBudget = await createBudget(tittel, epost);
    res.send(newBudget);
  });  

app.listen(port, () => {
    console.log(`budget API listening on ${port}`)
});