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

  weight: 4,

  tip: "Postal or courier scam: Verify unexpected parcel fees directly through the courier's official website or app. Do not use links supplied in the message.",

  patterns: [

    /\b(canada post|parcel|package|delivery|courier).{0,120}\b(on hold|held|border fee|customs fee|delivery fee|redelivery fee|payment required)\b/,

    /\b(parcel|package|delivery).{0,120}\b(pay|fee|required today|required tomorrow|due today|due tomorrow)\b/,

    /\b(canada post|parcel|package|delivery).{0,120}\b(click here|follow this link|http|https|www\.)\b/

  ]

},
{

  weight: 4,

  tip: "Bank security scam: Verify unexpected account alerts directly through your bank's official app, website, or phone number. Never use a link supplied in the message.",

  patterns: [

    /\b(td|td bank|rbc|royal bank|bmo|scotiabank|cibc|bank).{0,120}\b(account|card|online banking).{0,80}\b(suspended|locked|blocked|restricted|compromised|security alert)\b/,

    /\b(bank|account|debit card|credit card).{0,120}\b(verify|confirm|reactivate|unlock).{0,80}\b(click|link|visit|login|sign in)\b/,

    /\b(unusual activity|suspicious activity|unauthorized transaction|security alert).{0,120}\b(verify|confirm|click|login|sign in)\b/

  ]

},


{

  weight: 3,

  tip: "Suspicious link: Be cautious of shortened or unfamiliar web links. Visit the organization's official website yourself instead of using a link supplied in the message.",

  patterns: [

    /\b(bit\.ly|tinyurl\.com|t\.co|ow\.ly|is\.gd|cutt\.ly|rebrand\.ly|fyn\.is)\/\S+/,

    /\b[a-z0-9-]+\.(com|ca|net|org|co|io|is|ly|me|info)\/[a-z0-9_-]{3,}\b/,

    /\b(click|tap|visit|open|here).{0,60}\b(link|website|url)\b/

  ]

},


   {

  weight: 4,

  tip: "CRA or tax threats: Contact the CRA directly using official contact information. Do not use links or phone numbers supplied in the message.",

  patterns: [

    /\b(cra|canada revenue agency).{0,40}\b(owe|owing|debt|arrest|warrant|payment|pay now)\b/,

    /\b(tax|taxes).{0,30}\b(arrest|warrant|gift card|bitcoin|crypto)\b/

  ]

},

{

  weight: 2,

  tip: "Package delivery: Verify delivery problems directly through the courier's official website or app.",

  patterns: [

    /\b(package|parcel|delivery).{0,35}\b(fee|payment|required|failed|held|reschedule)\b/,

    /\bdelivery fee\b/

  ]

},

{

  weight: 3,

  tip: "Bank alert: Contact your bank using the number on your card or its official website. Do not use links in the message.",

  patterns: [

    /\b(account|card).{0,35}\b(suspended|locked|compromised|unauthorized|fraud)\b/,

    /\bverify.{0,20}\b(account|identity|banking)\b/

  ]

},

{

  weight: 3,

  tip: "Job offer: Be cautious of jobs that require upfront payments, unusual purchases, or transferring money.",

  patterns: [

    /\bjob offer\b.{0,40}\b(crypto|gift card|cheque|check|equipment|upfront|fee)\b/,

    /\b(work from home|remote job).{0,40}\b(easy money|no experience|daily pay)\b/

  ]

},
{

  weight: 4,

  tip: "Fake cheque or overpayment: Do not deposit a cheque and then send part of the money elsewhere. The cheque may later be reversed, leaving you responsible for the loss.",

  patterns: [

    /\b(cheque|check).{0,60}\b(deposit|cash).{0,60}\b(send|transfer|return).{0,40}\b(money|funds|remainder|remaining)\b/,

    /\b(overpayment|overpaid).{0,50}\b(send back|return|refund|transfer)\b/,

    /\bpurchase equipment.{0,60}\b(send|return|transfer).{0,40}\b(money|funds|remaining)\b/

  ]

},
{

  weight: 3,

  tip: "Prize or lottery: Legitimate prizes generally do not require you to pay a fee to collect winnings.",

  patterns: [

    /\b(winner|won|prize|lottery|sweepstakes).{0,40}\b(fee|tax|claim|payment)\b/,

    /\bcongratulations.{0,30}\b(won|winner|prize)\b/

  ]

},

{

  weight: 3,

  tip: "Refund scam: Verify unexpected refunds directly with the company or bank before returning any money.",

  patterns: [

    /\brefund.{0,40}\b(overpaid|accident|mistake|send back|return the money)\b/,

    /\bwe (overpaid|refunded too much)\b/

  ]

},
{

  weight: 3,

  tip: "Romance scam: Be cautious when someone you met online develops a relationship quickly and then asks for money, gift cards, cryptocurrency, or financial help.",

  patterns: [

    /\b(love|relationship|romance|dating).{0,80}\b(send|need|help|loan|money|gift card|crypto)\b/,

    /\b(met online|online dating).{0,80}\b(money|financial help|emergency|gift card|crypto)\b/,

    /\b(love you|my love|sweetheart).{0,80}\b(send money|need money|financial help)\b/

  ]

},
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

  tip: "Interac e-Transfer scam: Verify unexpected transfer or deposit notices through your bank's official app. Do not use links supplied in the message or enter banking credentials.",

  patterns: [

    /\b(interac|e-transfer|etransfer|money transfer).{0,120}\b(deposit|pending|waiting|claim|accept|refund|expired)\b/,

    /\b(interac|e-transfer|etransfer).{0,120}\b(click|tap|link|verify|login|sign in|banking information)\b/,

    /\b(refund|deposit|payment).{0,120}\b(interac|e-transfer|etransfer).{0,120}\b(click|link|claim|accept|verify)\b/

  ]

},

{

  weight: 4,

  tip: "Job or recruitment scam: Verify unexpected job offers directly with the employer. Never pay upfront fees, deposit a cheque to buy equipment, or send money to a recruiter.",

  patterns: [

    /\b(job offer|employment offer|recruiter|hiring|work from home|remote job).{0,140}\b(pay fee|training fee|registration fee|equipment fee|send money|deposit)\b/,

    /\b(job|employment|position|recruiter).{0,140}\b(cheque|check).{0,100}\b(equipment|computer|supplies|send money|e-transfer)\b/,

    /\b(interview|recruiter|hiring manager|job offer).{0,120}\b(whatsapp|telegram|signal).{0,100}\b(job|position|employment|interview)\b/,

    /\b(easy money|earn from home|work from home).{0,120}\b(no experience|daily pay|guaranteed income|quick money)\b/

  ]

},
  {

  weight: 4,

  tip: "Marketplace scam: Be cautious when a buyer or seller asks for unusual payment arrangements, overpays, sends a courier, or asks you to refund money. Keep payment and communication on the marketplace platform whenever possible.",

  patterns: [

    /\b(facebook marketplace|marketplace|kijiji|craigslist|buyer|seller).{0,140}\b(overpay|overpayment|extra money|refund|send back)\b/,

    /\b(buyer|seller).{0,140}\b(courier|shipping agent|pickup agent|someone will pick it up)\b/,

    /\b(marketplace|kijiji|buyer|seller).{0,140}\b(e-transfer|etransfer|interac|payment).{0,100}\b(link|email|confirm|verify)\b/,

    /\b(item|listing|purchase|sale).{0,140}\b(pay outside|outside the app|gift card|crypto|bitcoin)\b/

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

  tip: "Investment scam: Be wary of guaranteed profits, unusually high returns, or pressure to invest quickly. Verify the investment and the person offering it independently before sending money.",

  patterns: [

    /\b(guaranteed|risk[- ]?free).{0,80}\b(profit|return|investment|crypto|bitcoin)\b/,

    /\b(invest|investment|crypto|bitcoin).{0,80}\b(double your money|huge returns|high returns|guaranteed returns)\b/,

    /\b(exclusive investment|investment opportunity).{0,80}\b(act now|limited time|send|transfer|deposit)\b/

  ]

},

{

  weight: 4,

  tip: "Insurance scam: Verify policy cancellation, renewal, or payment requests directly with your insurer using contact information you find yourself.",

  patterns: [

    /\b(insurance|insurer|policy|coverage|premium).{0,100}\b(cancelled|canceled|suspended|expired|renew immediately|payment failed)\b/,

    /\b(policy|insurance|coverage).{0,100}\b(click|link|pay now|urgent|immediately)\b/,

    /\b(insurance|premium).{0,100}\b(gift card|crypto|bitcoin|wire transfer|e-transfer)\b/

  ]

},

{

  weight: 4,

  tip: "Insurance claims scam: Verify unexpected claims or adjuster requests directly with your insurer. Never pay a fee or provide banking details, passwords, PINs, or verification codes to release a claim.",

  patterns: [

    /\b(claim|insurance claim|claims department|adjuster).{0,100}\b(fee|payment|pay|deposit|processing fee)\b/,

    /\b(claim|adjuster|claims representative).{0,100}\b(banking|bank details|password|pin|verification code)\b/,

    /\b(claim approved|claim payment|settlement).{0,100}\b(pay fee|send money|release funds|processing fee)\b/

  ]

},

{
  weight: 4,
  tip: "Life insurance scam: Verify unexpected beneficiary, death benefit, or unclaimed policy notices directly with the insurer. Never pay a fee to release insurance proceeds.",
  patterns: [
    /\b(life insurance|beneficiary|death benefit|unclaimed life insurance|unclaimed policy).{0,220}\b(fee|administration fee|processing fee|payment|pay|e-transfer|transfer)\b/,
    /\b(unclaimed life insurance|unclaimed policy|beneficiary).{0,220}\b(receive|collect|claim|death benefit|insurance payout)\b/,
    /\b(death benefit|insurance payout|beneficiary).{0,180}\b(must first pay|pay first|administration fee|processing fee|send money|e-transfer)\b/
  ]
},
    {

  weight: 4,

  tip: "Ghost broker scam: Be cautious of unusually cheap insurance offered by an unverifiable broker. Confirm the broker and policy directly with the insurer before paying.",

  patterns: [

    /\b(insurance|auto insurance|car insurance|home insurance).{0,100}\b(cheap|cheapest|discount|special rate|low rate)\b/,

    /\b(broker|insurance agent).{0,100}\b(e-transfer|cash|personal account|pay first|deposit)\b/,

    /\b(policy|coverage).{0,100}\b(send payment|pay deposit|before documents|before policy)\b/

  ]

},{

      weight: 4,

      tip: "Personal information: Never share passwords, banking details, your SIN, PIN or verification codes.",

      patterns: [

        /\bpassword/,

        /\bbanking (information|details)\b/,

        /\bsocial insurance number\b/,

        /\bverification code\b/,

        /\bpin\b/ ,
/\bone[- ]time (code|password|passcode)\b/,

/\botp\b/,

/\bsecurity code\b/



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

  weight: 4,

  tip: "Tech support scam: Do not give unexpected callers or messages remote access to your computer or phone. Never install remote-control software or provide passwords, PINs, or verification codes at their request.",

  patterns: [

    /\b(microsoft|windows|apple|tech support|technical support|support team).{0,140}\b(virus|infected|malware|hacked|security alert|security problem|computer problem|account compromised)\b/,

    /\b(remote access|remote support|remote connection).{0,120}\b(computer|phone|device|screen)\b/,

    /\b(anydesk|teamviewer|ultraviewer|screenconnect|logmein|remote desktop).{0,120}\b(install|download|open|run|connect|access)\b/,

    /\b(support|technician|agent).{0,140}\b(password|pin|verification code|security code|banking information)\b/

  ]

},
{

  weight: 4,

  tip: "Impersonation scam: Verify unexpected requests from banks, government agencies, police, employers, or family members using contact information you trust.",

  patterns: [

    /\b(bank|police|government|cra|canada revenue agency|boss|ceo|family member|grandchild).{0,100}\b(send|transfer|pay|gift card|verification code|urgent|immediately)\b/,

    /\b(your boss|your bank|police|cra|government).{0,100}\b(send|pay|transfer|code|verify)\b/

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

