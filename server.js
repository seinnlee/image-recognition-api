const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '',
    database: 'image-recognition'
  }
});

const app = express();
app.use(express.json());
app.use(cors());

const saltRounds = 10;

app.get('/', (req, res) => { res.send('Welcome to Advanced Image-Recognition!') });

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });
// app.post('/signin', signin.handleSignIn(db, bcrypt)(req, res)); advanced function
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) }); //dependencies injection

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)  });

const PORT = process.env.PORT;
app.listen(PORT, () => { console.log(`App is running on port ${PORT}`); });



/*
Server Endpoints
/ --> res = this is working (root route)
/signin --> POST = success or fail
/register --> POST = user (new user object)
/profile/:userId --> GET = user (returns user object)
/image --> PUT = user (returns updated user object)
*/
