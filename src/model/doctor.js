const mongoose = require('mongoose')

const DoctorSchema = new mongoose.Schema(
	{
		SPECIALITY: { type: String, required: true },
		Hospital_Name: { type: String },
        DOCTOR_NAME: { type: String, required: true, unique: true },
        login_id: { type: String, required: true, unique: true },
        sub_speciality: { type: String, required: true},
        CHARGES: { type: String, required: true},
        languages: { type: String, required: true},
        password: { type: String, required: true, unique: true }


	},
	{ collection: 'doctor' }
)

const model = mongoose.model('DoctorSchema', DoctorSchema)

module.exports = model
