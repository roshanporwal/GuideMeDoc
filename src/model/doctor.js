const mongoose = require('mongoose')

const DoctorSchema = new mongoose.Schema(
	{
		speciality: { type: String },
		hospital_id: { type: String },
        doctor_name: { type: String },
        login_id: { type: String, required: true, unique: true },
        sub_speciality: { type: String},
        charges: { type: String},
        languages: { type: String},
        password: { type: String },
        doctor_bio:{ type: String },
        avatar:{ type: String }
	},
	{ collection: 'doctor' }
)

const model = mongoose.model('DoctorSchema', DoctorSchema)

module.exports = model
