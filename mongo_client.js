const { MongoClient } = require('mongodb')

let dbConnection;
let uri = 'mongodb+srv://preetam:got_api123@cluster0.hullpjm.mongodb.net/?retryWrites=true&w=majority'
module.exports = {
	connectToDb: (cb) => {
		MongoClient.connect(uri)
		.then((client) => {
			dbConnection = client.db()
			return cb()
		})
		.catch(err => {
			return cb(err)
		})
	},
	getDbConnection: () => dbConnection
}