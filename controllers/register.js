
const handleRegister = (req, res, db, bcrypt, saltRounds) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('User information must not be empty');
  }
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
}

module.exports = {
  handleRegister: handleRegister
}