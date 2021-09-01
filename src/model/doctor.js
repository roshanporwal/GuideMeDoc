const mongoose = require('mongoose')

const DoctorSchema = new mongoose.Schema(
	{
<<<<<<< HEAD
		SPECIALITY: { type: String },
=======
		SPECIALITY1: { type: String, required: true },
>>>>>>> 09ec194f72238a0c59ef41b74114c00ffbf9b3f7
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
