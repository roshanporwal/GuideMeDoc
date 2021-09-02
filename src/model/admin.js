const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema(
	{
		login_id: { type: String, required: true, unique: true },
		password: { type: String, required: true }
	},
	{ collection: 'admin' }
)

const model = mongoose.model('AdminSchema', AdminSchema)

module.exports = model

