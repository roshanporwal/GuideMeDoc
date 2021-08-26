const mongoose = require('mongoose')

const EnquriesSchema = new mongoose.Schema(
	{
		Patient_Name: { type: String, required: true },
		Email: { type: String },
        Current_Diagnosis: { type: String, required: true },
        Languages_spoken: { type: Array, required: true },
        Insurance_Card_copy: { type: String, required: true},
        Referred_by: { type: String, required: true},
        Medical_history: { type: String, required: true},
        Mobile_number: { type: String, required: true },
        age: { type: String, required: true },
        Requirement: { type: Array, required: true },
        Food_preferences: { type: String, required: true },
        Gender: { type: String, required: true },
        Nationality: { type: String, required: true },
        Identification_Document: { type: String, required: true },
        Reports: { type: String, required: true },
        Transport_support: { type: String, required: true },
        Accommodation: { type: String, required: true },
        Perferred_hospital_visit_type: { type: String, required: true },
        Proposed_Date_to_Avail_The_Service: { type: String, required: true },
        Planned_Duration_of_trip: { type: String, required: true }

	},
	{ collection: 'enquries' }
)

const model = mongoose.model('EnquriesSchema', EnquriesSchema)

module.exports = model
