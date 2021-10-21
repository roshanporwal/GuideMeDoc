const mongoose = require('mongoose')

const smartsearchidealSchema = new mongoose.Schema(
	{
	
		speciality:{ type: Array},
	
		insurance:{type :Array},
		
	},
	{ collection: 'Smartsearchideal' }
)

const model = mongoose.model('smartsearchidealSchema', smartsearchidealSchema)

module.exports = model
