const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

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

app.get('/', (req, res) => {
  res.send('Welcome to Advanced Image-Recognition!');
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      bcrypt.compare(password, data[0].hash, function (err, result) {
        if (result) {
          return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              res.json(user[0])
            }).catch(err => res.status(400).json('Unable to get user'))
        } else {
          res.status(400).json('Wrong Credentials')
        }
      });
    }).catch(err => res.status(400).json('Unable to get user'))
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      }).into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*') //returns all columns
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            }).then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
      .catch(err => res.status(400).json('Unable to Register'))
  });
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id: id })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    }).catch(err => res.status(400).json('Error getting user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    }).catch(err => res.status(400).json('Unable to get entries'))
})

// const checkUserPassword = (enteredPW, storedPW) => {
//   bcrypt.compare(enteredPW, storedPW);
// }




app.listen(3000, () => {
  console.log("app is running on port 3000");
});


/*
Server Endpoints
/ --> res = this is working (root route)
/signin --> POST = success or fail
/register --> POST = user (new user object)
/profile/:userId --> GET = user (returns user object)
/image --> PUT = user (returns updated user object)
*/