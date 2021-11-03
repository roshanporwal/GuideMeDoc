const mongoose = require('mongoose')

const MasterhospitalSchema = new mongoose.Schema(
	{
		login_id: { type: String, required: true, unique: true },
		password: { type: String, required: true }
	},
	{ collection: 'masterhospital' }
)

const model = mongoose.model('MasterhospitalSchema', MasterhospitalSchema)

module.exports = model

