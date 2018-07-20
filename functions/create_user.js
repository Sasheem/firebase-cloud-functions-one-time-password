const admin = require('firebase-admin');

module.exports = function(req, res) {
  // STEP 1 verify that the user provided a phone number
  // what else could I do to make sure this is also a valid phone number?
  if (!req.body.phone) {
    return res.status(422).send({ error: 'Bad Input' });
  }

  // STEP 2 format the phone number to remove dashes and parans
  // inside replace we make sure we do not accept nondigits using regex exp
  // regex = matches any character that is not a digit.
  const phone = String(req.body.phone).replace(/[^\d]/g);

  // STEP 3 create a new user account using that phone number
  admin.auth().createUser({ uid: phone })
    .then(user => res.send(user))
    .catch(error => res.status(422).send({ error }));

  // STEP 4 respond to the user request, saying the account was created

}
