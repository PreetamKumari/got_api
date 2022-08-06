const { MongoClient } = require('mongodb')

let dbConnection;
module.exports = {
	connectToDb: (cb) => {
		MongoClient.connect('mongodb://localhost:27017/game_of_thrones')
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