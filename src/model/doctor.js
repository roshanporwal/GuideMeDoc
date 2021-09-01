const mongoose = require('mongoose')

const DoctorSchema = new mongoose.Schema(
	{
		SPECIALITY: { type: String },
		Hospital_Name: { type: String },
        DOCTOR_NAME: { type: String },
        login_id: { type: String, required: true, unique: true },
        sub_speciality: { type: String},
        CHARGES: { type: String},
        languages: { type: String},
        password: { type: String }


	},
	{ collection: 'doctor' }
)

const model = mongoose.model('DoctorSchema', DoctorSchema)

module.exports = model
