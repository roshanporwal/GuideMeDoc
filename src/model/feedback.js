const mongoose = require('mongoose')

const FeedbackSchema = new mongoose.Schema(
	{
		patient_name: { type: String },
        current_diagnosis: { type: String },
        hospital_name:{ type: String },
        feedbackrating:{ type: String },
        feedbackmessage:{ type: Array },
        patient_id:{ type: String },
        
	},
	{ collection: 'feedback' }
)

const model = mongoose.model('FeedbackSchema', FeedbackSchema)

module.exports = model
