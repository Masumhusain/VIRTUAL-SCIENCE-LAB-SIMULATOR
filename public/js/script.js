
// function saveExperiment(type) {
//     let data = {};

//     if(type === "ohms") {
//         data = {
//             experiment: "Ohm’s Law",
//             voltage: document.querySelector("#voltageInput").value,
//             resistance: document.querySelector("#resistanceInput").value,
//             current: document.querySelector("#currentOutput").innerText
//         };
//     }

//     if(type === "acidbase") {
//         data = {
//             experiment: "Acid-Base Reaction",
//             acidM: document.querySelector("#acidMolarity").value,
//             baseM: document.querySelector("#baseMolarity").value,
//             acidV: document.querySelector("#acidVolume").value,
//             baseV: document.querySelector("#baseVolume").value,
//             ph: document.querySelector("#phOutput").innerText
//         };
//     }

//     if(type === "newton") {
//         data = {
//             experiment: "Newton’s Law",
//             mass: document.querySelector("#massInput").value,
//             force: document.querySelector("#forceInput").value,
//             angle: document.querySelector("#angleInput").value,
//             velocity: document.querySelector("#velocityOutput").innerText
//         };
//     }

//     // Backend DB ko bhejna
//     fetch("/save-experiment", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(data)
//     })
//     .then(res => res.json())
//     .then(res => alert("Experiment Saved!"))
//     .catch(err => console.error(err));
// }

