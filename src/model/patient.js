const mongoose = require('mongoose')

const PatientSchema = new mongoose.Schema(
	{
		name: { type: String },
        login_id: { type: String, required: true, unique: true },
        password: { type: String },
		dob: { type: String },
		gender: { type: String },
		email: { type: String },
		referredby: { type: String },
		nationality: { type: String },
		identification_document: { type: Array },
		insurance_card_copy: { type: Array},
		insurance_name:{ type: String },
		family: { type: Array },
	},
	{ collection: 'patient' }
)

const model = mongoose.model('PatientSchema', PatientSchema)

module.exports = model
