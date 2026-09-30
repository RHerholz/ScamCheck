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
const analyzeBtn = document.getElementById("analyze-btn");

const analyzeScreen = document.getElementById("analyze-screen");

const analyzeBackBtn = document.getElementById("analyze-back-btn");

const scanMessageBtn = document.getElementById("scan-message-btn");

const messageInput = document.getElementById("message-input");
const questionText = document.getElementById("question");

const progressText = document.getElementById("progress");

const riskResult = document.getElementById("risk-result");

const riskMessage = document.getElementById("risk-message");

startBtn.addEventListener("click", startCheck);
analyzeBtn.addEventListener("click", startAnalysis);

analyzeBackBtn.addEventListener("click", closeAnalysis);
scanMessageBtn.addEventListener("click", analyzeMessage);


yesBtn.addEventListener("click", () => answerQuestion(true));

noBtn.addEventListener("click", () => answerQuestion(false));

backBtn.addEventListener("click", goBack);

restartBtn.addEventListener("click", restartCheck);
function startAnalysis() {

  welcomeScreen.classList.add("hidden");

  analyzeScreen.classList.remove("hidden");

  messageInput.value = "";

}

function closeAnalysis() {

  analyzeScreen.classList.add("hidden");

  welcomeScreen.classList.remove("hidden");

}
function analyzeMessage() {

  const message = messageInput.value.trim();

  if (!message) {
  
    alert("Paste a message first so Sam has something to sniff.");

    return;

  }

  const text = message.toLowerCase();

  const rules = [

    {

      weight: 2,

      tip: "Urgency: Slow down. Do not let anyone pressure you into making an immediate decision.",

      patterns: [

        /\burgent\b/,

        /\bimmediately\b/,

        /\bact now\b/,

        /\bfinal warning\b/

      ]

    },

    {

      weight: 3,

      tip: "Threats: Contact the organization independently to verify threats or serious consequences.",

      patterns: [

        /\barrest\b/,

        /\bwarrant\b/,

        /\blegal action\b/,

        /\baccount (closed|suspended|locked)\b/

      ]

    },

    {

      weight: 4,

      tip: "Unusual payments: Be suspicious of requests involving gift cards, cryptocurrency or wire transfers.",

      patterns: [

        /\bgift card/,

        /\bbitcoin\b/,

        /\bcrypto/,

        /\bwire transfer/

      ]

    },

    {

      weight: 4,

      tip: "Personal information: Never share passwords, banking details, your SIN, PIN or verification codes.",

      patterns: [

        /\bpassword/,

        /\bbanking (information|details)\b/,

        /\bsocial insurance number\b/,

        /\bverification code\b/,

        /\bpin\b/

      ]

    },

    {

      weight: 3,

      tip: "Links and remote access: Avoid suspicious links, downloads, QR codes and requests for remote access.",

      patterns: [

        /\bclick (this|the) link\b/,

        /\bscan (this|the) qr\b/,

        /\bremote access\b/,

        /\banydesk\b/,

        /\bteamviewer\b/

      ]

    },

    {

      weight: 3,

      tip: "Secrecy: Be cautious if someone tells you not to discuss the situation with other people.",

      patterns: [

        /\bdon't tell\b/,

        /\bdo not tell\b/,

        /\bkeep this (a )?secret\b/,

        /\bdon't discuss\b/

      ]

    }

  ];

  const matches = rules.filter(rule =>

    rule.patterns.some(pattern => pattern.test(text))

  );

  const messageScore = matches.reduce(

    (total, rule) => total + rule.weight,

    0

  );

  const samMessage = document.getElementById("sam-message");

  const adviceBox = document.getElementById("personalized-advice");

  const adviceList = document.getElementById("advice-list");

  riskResult.className = "";

  adviceList.replaceChildren();

  matches.forEach(rule => {

    const item = document.createElement("li");

    item.textContent = rule.tip;

    adviceList.appendChild(item);

  });

  adviceBox.hidden = matches.length === 0;

  if (messageScore >= 7) {

    riskResult.textContent = "HIGH RISK";

    riskResult.classList.add("high-risk");

    samMessage.textContent =

      "STOP! Sam detected several serious scam warning signs.";

    riskMessage.textContent =

      "This message contains multiple patterns commonly associated with scams. Do not send money, share sensitive information, click suspicious links, or provide remote access.";

  } else if (messageScore >= 2) {

    riskResult.textContent = "CAUTION";

    riskResult.classList.add("medium-risk");

    samMessage.textContent =

      "Hold on! Sam found one or more warning signs worth checking.";

    riskMessage.textContent =

      "Verify the sender or organization independently before taking action, sending money, or sharing information.";

  } else {

    riskResult.textContent = "LOW CONCERN";

    riskResult.classList.add("low-risk");

    samMessage.textContent =

      "Sam did not detect common scam language, but stay alert.";

    riskMessage.textContent =

      "An automated scan cannot guarantee a message is safe. Verify the sender independently if anything feels unusual.";

  }

  analyzeScreen.classList.add("hidden");

  questionScreen.classList.add("hidden");

  resultScreen.classList.remove("hidden");

}



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
  const samMessage = document.getElementById("sam-message");

const adviceBox = document.getElementById("personalized-advice");
const adviceList = document.getElementById("advice-list");
adviceList.replaceChildren();

adviceBox.hidden = true;

const safetyTips = [

  "Unexpected contact: Verify who is contacting you before responding.",

  "Urgency: Never let anyone pressure you into making an immediate decision.",

  "Threats: Contact the organization independently to verify any threats or claims.",

  "Money requests: Never send money without independently verifying the recipient.",

  "Unusual payments: Be suspicious of requests involving gift cards, cryptocurrency or wire transfers.",

  "Personal information: Never share passwords, banking details or other sensitive information with an unverified contact.",

  "Suspicious links: Avoid unknown links, downloads and requests for remote access.",

  "Secrecy: Be cautious if someone tells you not to discuss the situation with family, your bank or the authorities."

];

answerHistory.forEach((answer, index) => {

  if (answer === true) {

    const item = document.createElement("li");

    item.textContent = safetyTips[index];

    adviceList.appendChild(item);

    adviceBox.hidden = false;

  }

});


const warningWeights = [1, 2, 3, 3, 4, 4, 4, 3];

const weightedScore = answerHistory.reduce(

  (total, answer, index) =>

    total + (answer ? warningWeights[index] : 0),

  0

);
  if (weightedScore <= 1) {

    riskResult.textContent = "LOW CONCERN";
   samMessage.textContent = "My sniff test found few warning signs. But stay alert and always verify independently!"; 

    riskResult.classList.add("low-risk");

    riskMessage.textContent =

      "Few common scam warning signs were detected. That does not guarantee the situation is safe. Verify the person or organization independently before sharing money or sensitive information.";

  } else if (weightedScore <= 4) {
samMessage.textContent = "Hold on! Something doesn't smell right. Verify independently before taking action.";
    riskResult.textContent = "CAUTION";

    riskResult.classList.add("medium-risk");

    riskMessage.textContent =

    "One or more scam warning signs were detected. Do not send money or sensitive information until you have independently verified the person or organization.";



  } else {

    riskResult.textContent = "HIGH RISK";
 samMessage.textContent = "STOP! I'm detecting serious warning signs. Do not send money or share personal information. Verify independently!";   

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

