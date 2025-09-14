const mongoose = require("mongoose");

const motionExperimentSchema = new mongoose.Schema({
  done_by: {
     type: String,
    required: true }, 
  mass: Number,          // kg
  force: Number,         // N
  angle: Number,         // degree
  gravity: Number,       // m/s^2
  mu_s: Number,          // static friction
  mu_k: Number,          // kinetic friction

  a: Number,             // acceleration
  v: Number,             // velocity
  x: Number,             // displacement
  N: Number,             // normal force
  f: Number,             // friction
  netF: Number, // ΣF
  created_at: { type: Date, default: Date.now }
});

const MotionExperiment =  mongoose.model("MotionExperiment", motionExperimentSchema);



module.exports = MotionExperiment;