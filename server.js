const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'Sally@gmail.com',
      password: 'ilovebananas',
      entries: 0,
      joined: new Date()
    }
  ],
  // login: [
  //   {
  //     id: '987',
  //     hash: '',
  //     email: 'john@gmail.com'
  //   }
  // ]
}

const saltRounds = 10;

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  // const userHash = database.login[0].hash;
  if (email === database.users[0].email && password === database.users[0].password) {
    res.send(database.users[0]);
  } else {
    res.status(400).json("wrong credentials");
  }
  // if (email === database.users[0].email) {
  //   bcrypt.compare(password, userHash, function (err, result) {
  //     console.log("first guess", res);
  //     res.send("success");
  //   });
  //   bcrypt.compare(password, userHash, function (err, result) {
  //     console.log("second guess", res);
  //     res.status(400).send("wrong password");
  //   });
  // } else {
  //   res.status(400).json("wrong email");
  // }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    console.log(hash);
  });
  database.users.push({
    id: '125',
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(400).json("not found");
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(400).json("not found");
  }
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