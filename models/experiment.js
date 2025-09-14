const mongoose = require("mongoose");

const experimentSchema = new mongoose.Schema({
   experiment_name: { 
    type: String, 
    required: true },

    done_by: {
     type: String,
    required: true }, 
    
  voltage: String,
  current: String,
  resistance: String,
  power: String,
  created_at: { type: Date, default: Date.now }
});

const Experiment = mongoose.model("Experiment", experimentSchema);



module.exports = Experiment;