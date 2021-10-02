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
        reports: { type: Array },
        status:{ type: String },
        hospitals:{type:Array},
        insurance_name:{ type: String },
        value:{ type: String },
        commission:{ type: String },
        hospital_name:{ type: String },
        feedbackrating:{ type: String },
        feedbackmessage:{ type: Array },
        airport_transfer_needed:{ type: String },
        ambulance_support_needed:{ type: String },
        medical_visa_arrangements:{ type: String },
        id:{ type: String },
        
	},
	{ collection: 'enquries' }
)

const model = mongoose.model('EnquriesSchema', EnquriesSchema)

module.exports = model
