const mongoose = require('mongoose')

const HospitalSchema = new mongoose.Schema(
	{
		Hospital_Name: { type: String, required: true},
		Google_location: { type: String, required: true },
        login_id: { type: String, required: true, unique: true },
		password: { type: String, required: true},
	},
	{ collection: 'hospitals' }
)

const model = mongoose.model('HospitalSchema', HospitalSchema)

module.exports = model
