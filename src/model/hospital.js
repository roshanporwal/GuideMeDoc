const mongoose = require('mongoose')

const HospitalSchema = new mongoose.Schema(
	{
		hospital_name: { type: String, required: true},
		google_location: { type: String },
        login_id: { type: String, required: true, unique: true },
		password: { type: String, required: true},
		speciality:{ type: Array},
		phno:{ type: String},
		address:{ type: String},
	},
	{ collection: 'hospitals' }
)

const model = mongoose.model('HospitalSchema', HospitalSchema)

module.exports = model
