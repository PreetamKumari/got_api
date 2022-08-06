const cors = require('cors')
const express = require('express');
const {ObjectId} = require('mongodb')
const { connectToDb, getDbConnection} = require('./mongo_client')
const { INITIAL_PAGE, CHARACTERS_PER_PAGE } = require('./common.js')

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3000

app.use(express.json())

let db;
connectToDb((err) => {
	if(!err) {
		app.listen(PORT, () => {
			console.log(`app listening at 3000`)
		})
		db = getDbConnection()
	}
})


app.get('/api/characters', (req, res) => {
	//search by name
	const name = req.query.name
	const house = req.query.house
	//pagination
	const page = req.query.page || INITIAL_PAGE
	let characters = []
	db.collection('characters')
	.find({
		$and: [
			{name: new RegExp(name, 'i')},
			{house: new RegExp(house, 'i')}
		]
	})
	.skip(page * CHARACTERS_PER_PAGE)
	.limit(CHARACTERS_PER_PAGE)
	.forEach((character) => characters.push(character))
	.then(() => {
		res.status(200).json(characters)
	})
	.catch(() => {
		res.status(500).json({
			error: `Couldn't find any characters`
		})
	})
})

app.post('/api/characters', (req, res) => {

	db.collection('characters')
	.insertMany(req.body)
	.then((result) => {
		res.status(201).json(result)
	})
	.catch(() => {
		res.status(500).json({
			err: `Could not create character`
		})
	})
})

app.get('/api/characters/:id', (req, res) => {
	const id = req.params.id
	db.collection('characters')
	.findOne({ _id: ObjectId(id) })
	.then((character) => {
		res.status(200).json(character)
	})
	.catch(() => {
		res.status(500).json({
			error: `Couldn't find any character`
		})
	})
})

app.get('/api/quotes', (req, res) => {
	const name = req.query.author
	const quotes = []
	db.collection('quotes')
	.find({author: name})
	.forEach((quote) => quotes.push(quote))
	.then(() => {
		res.status(200).json(quotes)
	})
	.catch(() => {
		res.status(500).json({
			error: `Couldn't find any quotes`
		})
	})
})

app.get('/api/quotes/random', (req, res) => {
	const name = req.query.author
	const quotes = []
	db.collection('quotes')
	.aggregate(
		[ 
			{ $match: {author: new RegExp(name, 'i')} },
			{ $sample: { size: 1 } } 
		]
	 )
	.forEach((quote) => quotes.push(quote))
	.then(() => {
		res.status(200).json(quotes)
	})
	.catch(() => {
		res.status(500).json({
			error: `Couldn't find any quote`
		})
	})
})

app.post('/api/quotes', (req, res) => {

	db.collection('quotes')
	.insertMany(req.body)
	.then((result) => {
		res.status(201).json(result)
	})
	.catch(() => {
		res.status(500).json({
			err: `Could not create quote`
		})
	})
})