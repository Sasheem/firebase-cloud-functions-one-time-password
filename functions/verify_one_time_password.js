const admin = require('firebase-admin');

module.exports = function (req, res) {
  // user enters code
  // compare codes
  // mark code as no longer being valid
  // return a jwt to user

  // make sure user passed along code and phone number
  if (!req.body.phone || !req.body.code) {
    return res.status(422).send({ error: 'Phone and code must be provided' });
  }

  // scrub our values so we know they will be in the form we want
  const phone = String(req.body.phone).replace(/[^\d]/g, '');
  const code = parseInt(req.body.code);

  admin.auth().getUser(phone)
    .then(() => {
      const ref = admin.database.ref(`users/${phone}`);
      ref.on('value', snapshot => {
        // after we have gotten a value one time, do not attempt to listen for value changes
        ref.off();
        const user = snapshot.val();

        // code on our server vs code that user sent us
        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: 'code not valid' });
        }

        // user has successfully submitted the correct code at this point
        ref.update({ codeValid: false });

        // generate and return a jwt to user
        // pass in id of user we wanna associate token with
        admin.auth().createCustomToken(phone)
          .then(token => res.send({ token: token }))
          .catch(error => res.status(422).send({ error }));
      });

      return null;
    })
    .catch((error) => res.status(422).send({ error: error }));
}
