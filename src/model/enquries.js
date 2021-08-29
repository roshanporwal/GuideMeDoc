const mongoose = require('mongoose')

const EnquriesSchema = new mongoose.Schema(
	{
		patient_name: { type: String },
		patient_email: { type: String },
        patient_age: { type: String },
        patient_gender: { type: String },
        patient_mobile: { type: String },
        patient_nationality: { type: String },
        patient_referred_by: { type: String },
        preferred_hospital_visit: { type: String },
        current_diagnosis: { type: String },
        accomodation: { type: String },
        food_preferences: { type: String },
        from_date: { type: String },
        languages_spoken: { type: Array },
        medical_history: { type: String },
        proposal_date: { type: String },
        proposed_treatment_plan: { type: Array },
        to_date: { type: String },
        transport_support_needed: { type: String },
        insurance_card_copy: { type: Array},
        identification_document: { type: Array },
        reports: { type: Array }
	},
	{ collection: 'enquries' }
)

const model = mongoose.model('EnquriesSchema', EnquriesSchema)

module.exports = model
