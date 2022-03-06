const { DocumentStore } = require('ravendb');

const dotenv = require('dotenv');
dotenv.config();


const url = process.env.RAVENDB_URL;
const dbname = process.env.RAVENDB_DBNAME;

const store = new DocumentStore(url, dbname);
store.initialize();
module.exports = store;

// TODO: Switch to secured db
// https://ravendb.net/docs/article-page/5.3/nodejs/client-api/setting-up-authentication-and-authorization