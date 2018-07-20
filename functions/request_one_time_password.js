const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function(req, res) {
  // STEP 1 verify that the user provided a phone number
  // user requests to log in with phone number?
  if (!req.body.phone) {
    // 422 code means unprocessable entity
    return res.status(422).send({ error: 'you must provide a phone number' });
  }

  // STEP 2 format the phone number to remove dashes and parans
  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  // STEP 3 fetch user model by phone number
  // generate the code
  // save code to users record
  // text the code to the user
  admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor((Math.Random() * 8999 + 1000));

      twilio.messages.create({
        body: `Your code is ${code}`,
        to: phone,
        from: '+19543887608'
      }, (error) => {
        if (error) { return res.status(422).send(error); }

        // generate a new record in firebase database
        // save code to that db
        // created new collection called users
        // inside this collection, we added a phone number
        admin.database().ref(`users/${phone}`)
          .update({ code: code, codeValid: true }, () => {
            res.send({ success: true });
          });
        // CONTINUE TESTING AT MINUTE 2:32 sec7lec62 after you upgrade firebase account
        // maybe using template strings is breaking the code?
        // probably cause of account tho
      });

      return null;
    })
    .catch((error) => {
      res.status(422).send({ error });
    });
}
