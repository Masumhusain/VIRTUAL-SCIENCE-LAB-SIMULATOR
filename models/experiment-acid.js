const mongoose = require("mongoose");

const experimentAcidSchema = new mongoose.Schema(
  {
    done_by: {
     type: String,
    required: true }, 
    acidMolarity: { type: Number, required: true },   // e.g. 1.0
    baseMolarity: { type: Number, required: true },   // e.g. 1.0
    acidVolume: { type: Number, required: true },     // mL
    baseVolume: { type: Number, required: true },     // mL
    pH: { type: Number,
      required: true
    },             // e.g. "pH 7.00"
    status: { type: String, default: "Mix complete" },// experiment status
    createdAt: { type: Date, default: Date.now }
  },
);

const ExperimentAcid = mongoose.model("ExperimentAcid", experimentAcidSchema);

module.exports  =  ExperimentAcid;
