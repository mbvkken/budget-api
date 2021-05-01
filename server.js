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
    deleteBudget,
    updateBudget
 } = require('./services/database-budsjett');

 const {
    lagNyKategori,
    slettKategori,
    endreKategori,
    getKatsByBudsjettID
 } = require('./services/database-kategori');

const { 
    slettBudsjettpost,
    endreBudsjettpost,
    lagNyBudsjettpost,
    getBudsjettposter
} = require('./services/database-budsjettpost');

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

// Session
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

// budsjett
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

app.delete('/budsjett/:budsjettID', async (req, res) => {
    const { budsjettID } = req.params;
    await deleteBudget(budsjettID);
    res.send({budsjettID});
})

app.put('/budsjett/:budsjettID', async (req, res) => {
    const { nyTittel, budsjettID } = req.body;
    const nyttBudsjett = await updateBudget(nyTittel, budsjettID);
    res.send(nyttBudsjett);
})


//budsjettpost
app.post('/budsjettpost', async (req, res) => {
    const { tittel, sum, fast, kategoriID} = req.body;
    const nyBudsjettpost = await lagNyBudsjettpost(tittel, sum, fast, kategoriID);
    res.send(nyBudsjettpost);
})

app.delete('/budsjettpost/:budsjettpostID', async (req, res) => {
    const { budsjettpostID } = req.body;
    await slettBudsjettpost(budsjettpostID);
    res.send(budsjettpostID);
})

app.put('/budsjettpost/:budsjettpostID', async (req, res) => {
    const { nyTittel, nySum, nyFast, budsjettpostID } = req.body;
    const endretBudsjettpost = await endreBudsjettpost(nyTittel, nySum, nyFast, budsjettpostID);
    res.send(endretBudsjettpost);
})

app.get('/budsjettpost/:kategoriID', async (req, res) => {
    const { kategoriID } = req.params;
    const budsjettposterByKat = await getBudsjettposter(kategoriID);
    res.send(budsjettposterByKat);
})


// kategori
app.post('/kategori', async (req, res) => {
    const { tittel, budsjettID } = req.body;
    const nyKategori = await lagNyKategori(tittel, budsjettID);
    res.send(nyKategori);
})

app.get('/kategori/:budsjettID', async (req, res) => {
    const { budsjettID } = req.params;
    const kats = await getKatsByBudsjettID(budsjettID);
    res.send(kats);
  });

app.put('/kategori/:kategoriID', async (req, res) => {
    const { nyTittel, kategoriID } = req.body;
    const kategori = await endreKategori(nyTittel, kategoriID);
    res.send(kategori);
})

app.delete('/kategori/:kategoriID', async (req, res) => {
    const { kategoriID } = req.body;
    await slettKategori(kategoriID);
    res.send(kategoriID);
})

app.listen(port, () => {
    console.log(`budget API listening on ${port}`)
});

