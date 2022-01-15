const mongoose = require('mongoose')

const EnquriesSchemapatient = new mongoose.Schema(
	{


        name: { type: String },
        password: { type: String },
		age: { type: String },
		gender: { type: String },
		email: { type: String },
        mobile:{ type: String },
		referred: { type: String },
		nationality: { type: String },
		identification_document: { type: Array },
		insurance_card_copy: { type: Array},
        location:{ type: String },
        servicefor: { type: String},
        symptoms:{ type: String},
        preferred_hospital_doctor:{ type: String},
        preferred_date_first:{ type: String},
        preferred_date_second:{ type: String},
        patientid:{ type: String},
        type:{ type: String},
        subtype:{ type: String},
        referredby: { type: String },
        date_and_time_delivery: { type: String },
        address_patient: { type: String },
        alternate_number: { type: String },
        your_request: { type: String },
        preferred_gender: { type: String },
        languages_prefer: { type: String },
        payment_mode: { type: String },
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
        patient_lost_reason:{ type: String },
        
	},
	{ collection: 'enquriespatient' }
)

const model = mongoose.model('EnquriesSchemapatient', EnquriesSchemapatient)

module.exports = model