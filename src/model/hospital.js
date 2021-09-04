const mongoose = require('mongoose')

const HospitalSchema = new mongoose.Schema(
	{
		hospital_name: { type: String, required: true},
		google_location: { type: String, required: true },
        login_id: { type: String, required: true, unique: true },
		password: { type: String, required: true},
	},
	{ collection: 'hospitals' }
)

const model = mongoose.model('HospitalSchema', HospitalSchema)

module.exports = model
