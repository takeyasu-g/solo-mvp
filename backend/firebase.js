const admin = require('firebase-admin');
const firebaseAccount = require("./firebase-admin-creds.json"); // make sure to.gitignore this file !

// set admin with firebase account credentials
admin.initializeApp({
    credential: admin.credential.cert(firebaseAccount)
});

module.exports = admin;