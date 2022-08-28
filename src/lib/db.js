const mongoose = require('mongoose');
const DB_URL = 'mongodb+srv://stuneed:Yuri3ki469S7umWo@clusterstuneed.nrkob.mongodb.net/test';
//mongodb+srv://stuneed:stune3d%40141@cluster0.02k3q.mongodb.net/test?authSource=admin&replicaSet=atlas-4kk9g7-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true
mongoose.connect(DB_URL, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...') })