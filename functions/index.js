const admin = require('firebase-admin');
const functions = require('firebase-functions');
const createUser = require('./create_user');
const serviceAccount = require('./service_account.json');

// gives access to our data sitting in firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project-one-react-native.firebaseio.com"
});

// anytime a https request comes in, run the function - createUser
exports.createUser = functions.https.onRequest(createUser);
