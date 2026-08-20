const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Simulation logic requirements:
app.get("/", (req, res) => res.send("Backend running"));

// - Start all scores at 50
// - Adjust based on: bmi, sleep, activity, diet, smoking, alcohol
// - Clamp scores between 0–100
// - No randomness
//
// Risk levels:
// - >= 75 -> Low
// - 50–74 -> Moderate
// - < 50 -> High
function getLevel(score) {
    if (score >= 70) return "high";      // high risk
    if (score >= 45) return "moderate";  // moderate risk
    return "healthy";                    // low risk (healthy)
}


function clamp(val) {
    return Math.max(0, Math.min(100, Math.round(val)));
}

app.post('/v1/health-report', (req, res) => {
    // Request body: { age, bmi, sleep, activity, smoking, alcohol, diet }
    const { bmi = 22, sleep = 8, activity = 3, diet = "good", smoking = false, alcohol = false } = req.body || {};

    // Base score = 50
    const base = 50;
    
    // Some basic deterministic adjustments (arbitrary rules that follow the constraints)
    // Diet: "good" = +0, "average" = -5, "poor" = -15
    const dietPen = diet === "poor" ? -15 : (diet === "average" ? -5 : 0);
    // Smoking: true = -20
    const smokePen = smoking ? -20 : 0;
    // Alcohol: true = -10
    const alcoholPen = alcohol ? -10 : 0;
    // BMI: ideal around 22. Penalty = diff from 22
    const bmiDiff = Math.abs(bmi - 22);
    const bmiPen = -(bmiDiff * 1.5);
    // Sleep: ideal around 8
    const sleepDiff = Math.max(0, 8 - sleep);
    const sleepPen = -(sleepDiff * 3);
    // Activity: 0-5 scale roughly. Penalty/Bonus
    const activityBonus = (activity - 3) * 5;

    // Base modifications
    let heart = base + dietPen + smokePen + alcoholPen + bmiPen + activityBonus;
    let brain = base + sleepPen + smokePen + activityBonus;
    let lungs = base + smokePen * 1.5 + activityBonus;
    let liver = base + dietPen + alcoholPen * 1.5 + bmiPen;
    let kidneys = base + dietPen + alcoholPen + bmiPen + sleepPen;

    heart = clamp(heart);
    brain = clamp(brain);
    lungs = clamp(lungs);
    liver = clamp(liver);
    kidneys = clamp(kidneys);

    const issues = [];
    if (smoking) issues.push("Smoking reduces heart and lung scores significantly.");
    if (alcohol) issues.push("Alcohol impacts liver and kidney function.");
    if (bmi > 25) issues.push("A higher BMI adds stress to cardiovascular systems.");
    else if (bmi < 18.5) issues.push("A low BMI might indicate malnutrition affecting overall organ health.");
    if (diet === "poor") issues.push("A poor diet degrades organ capabilities.");
    if (sleep < 6) issues.push("Lack of sleep heavily impairs cognitive (brain) function.");

    const narrative = issues.length > 0 
        ? "Your simulation reveals several areas for improvement. " + issues.join(" ") 
        : "Your current lifestyle maintains a healthy equilibrium across your digital twin's organs.";

    // Generate deterministic trends (e.g. slight drift)
    const trends = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => {
        const drift = i * 2;
        return {
            month,
            heart: clamp(heart + drift),
            brain: clamp(brain - drift * 0.5),
            lungs: clamp(lungs + drift * 0.2),
            // Including liver and kidneys just in case, though the prompt asked for specific ones,
            // the UI might expect all. The prompt specifically said return heart, brain, lungs, liver, kidneys in organs.
            // In trends prompt example: { "month": "Jan", "heart": number, "brain": number, "lungs": number }
            // Let's add liver and kidneys optionally to avoid breaking the frontend if it uses them.
            liver: clamp(liver + drift * 0.5),
            kidneys: clamp(kidneys - drift * 0.2)
        };
    });

    const response = {
        organs: {
            heart: { score: heart, level: getLevel(heart) },
            brain: { score: brain, level: getLevel(brain) },
            lungs: { score: lungs, level: getLevel(lungs) },
            liver: { score: liver, level: getLevel(liver) },
            kidneys: { score: kidneys, level: getLevel(kidneys) }
        },
        narrative,
        trends
    };

    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Backend mirroring frontend expectations running on http://localhost:${PORT}`);
});
