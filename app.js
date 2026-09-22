const questions = [

  "Did they contact you unexpectedly?",

  "Are they pressuring you to act immediately?",

  "Are they threatening arrest, account closure, legal trouble, lost benefits, or another serious consequence?",

  "Are they asking you to send money or pay an upfront fee?",

  "Are they asking for payment by gift card, cryptocurrency, wire transfer, or another unusual method?",

  "Are they asking for passwords, banking information, your SIN, PIN, or other sensitive information?",

  "Are they asking you to click a link, download something, scan a QR code, or give them remote access to your device?",

  "Are they telling you not to discuss this with family, your bank, police, or anyone else?"

];

let currentQuestion = 0;

let score = 0;
let answerHistory = [];



const welcomeScreen = document.getElementById("welcome-screen");

const questionScreen = document.getElementById("question-screen");

const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");

const yesBtn = document.getElementById("yes-btn");

const noBtn = document.getElementById("no-btn");
const backBtn = document.getElementById("back-btn");




const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question");

const progressText = document.getElementById("progress");

const riskResult = document.getElementById("risk-result");

const riskMessage = document.getElementById("risk-message");

startBtn.addEventListener("click", startCheck);

yesBtn.addEventListener("click", () => answerQuestion(true));

noBtn.addEventListener("click", () => answerQuestion(false));

backBtn.addEventListener("click", goBack);

restartBtn.addEventListener("click", restartCheck);

function startCheck() {

  currentQuestion = 0;

  score = 0;

  welcomeScreen.classList.add("hidden");

  resultScreen.classList.add("hidden");

  questionScreen.classList.remove("hidden");

  showQuestion();

}

function showQuestion() {

yesBtn.classList.remove("selected");

noBtn.classList.remove("selected");  

  questionText.textContent = questions[currentQuestion];

  progressText.textContent =

    `Question ${currentQuestion + 1} of ${questions.length}`;

}

function answerQuestion(answerYes) {
  answerHistory.push(answerYes);
  (answerYes ? yesBtn : noBtn).classList.add("selected");

  if (answerYes) {

    score++;

  }

  currentQuestion++;

  if (currentQuestion < questions.length) {

    showQuestion();

  } else {

    showResult();

  }
}

  function goBack() { 
    if (currentQuestion === 0) return;
    currentQuestion--;
    const previousAnswer = answerHistory.pop();
    if (previousAnswer === true) score--;
    showQuestion();
  }
    
 







function showResult() {

  questionScreen.classList.add("hidden");

  resultScreen.classList.remove("hidden");

  riskResult.className = "";

  if (score <= 2) {

    riskResult.textContent = "LOW CONCERN";

    riskResult.classList.add("low-risk");

    riskMessage.textContent =

      "Few common scam warning signs were detected. That does not guarantee the situation is safe. Verify the person or organization independently before sharing money or sensitive information.";

  } else if (score <= 4) {

    riskResult.textContent = "CAUTION";

    riskResult.classList.add("medium-risk");

    riskMessage.textContent =

      "Several common scam warning signs were detected. Do not send money or sensitive information until you have independently verified the person or organization.";

  } else {

    riskResult.textContent = "HIGH RISK";

    riskResult.classList.add("high-risk");

    riskMessage.textContent =

      "Multiple strong scam warning signs were detected. Stop and verify independently. Do not send money, provide sensitive information, click suspicious links, or give remote access to your device.";

  }

}

function restartCheck() {

  currentQuestion = 0;

  score = 0;
  answerHistory = [];

  resultScreen.classList.add("hidden");

  questionScreen.classList.add("hidden");

  welcomeScreen.classList.remove("hidden");

}

