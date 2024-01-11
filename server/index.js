const express = require("express");
const cors = require("cors");
const spacy = require("spacy");
const { word_tokenize } = require("nltk");

const app = express();
const port = 3001;

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.post("/api/tokenize/spacy", (req, res) => {
  const { text } = req.body;
  const doc = spacy(text);
  const tokens = doc.map((token) => token.text);
  res.json({ tokens });
});

app.post("/api/tokenize/nltk", (req, res) => {
  const { text } = req.body;
  const tokens = word_tokenize(text);
  res.json({ tokens });
});

app.post("/api/style", (req, res) => {
  const { response, styleTokens, selectedStyle } = req.body;
  const styledResponse = applyStyle(response, styleTokens, selectedStyle);

  res.json({ styledResponse });
});

app.options("/api/style", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function applyStyle(response, styleTokens, selectedStyle) {
  const styleModifications = {
    Motivational: {
      "welcome to": "Get ready to",
      questions: "challenges",
      achieve: "conquer",
      amazing: "extraordinary",
      success: "triumph",
      empower: "strengthen",
      inspire: "motivate",
      greatness: "excellence",
      overcome: "surpass",
      victory: "achievement",
      excellence: "superiority",
      breakthrough: "innovation",
      ambition: "aspiration",
      persevere: "endure",
      determination: "resolve",
      resilience: "tenacity",
      dream: "vision",
      passion: "enthusiasm",
      dedication: "commitment",
      potential: "capability",
      transform: "change",
      thrive: "prosper",
      empower: "enable",
      elevate: "lift",
      triumph: "victory",
      accomplish: "achieve",
      purpose: "meaning",
      positivity: "optimism",
      fulfillment: "satisfaction",
    },
    Formal: {
      "welcome to": "Greetings",
      questions: "inquiries",
      please: "kindly",
      excellent: "outstanding",
      appreciate: "acknowledge",
      assist: "support",
      consider: "reflect",
      communicate: "convey",
      recommend: "advise",
      knowledge: "wisdom",
      understanding: "comprehension",
      participate: "engage",
      collaborate: "cooperate",
      valuable: "precious",
      efficient: "effective",
      initiative: "enterprise",
      enhance: "improve",
      recognize: "acknowledge",
      commendable: "praiseworthy",
      contribute: "contribute",
      professional: "expert",
      courtesy: "politeness",
      diligence: "carefulness",
      accomplish: "achieve",
      diligence: "carefulness",
      acquire: "obtain",
      implement: "execute",
      prioritize: "focus",
      strive: "endeavor",
      dedication: "commitment",
    },
    Casual: {
      "welcome to": "Hey there",
      questions: "any questions",
      cool: "awesome",
      "hang out": "chill",
      fun: "enjoyable",
      friend: "buddy",
      relax: "unwind",
      easygoing: "laid-back",
      connect: "bond",
      party: "celebrate",
      chat: "talk",
      share: "exchange",
      cool: "awesome",
      awesome: "fantastic",
      fantastic: "amazing",
      impressive: "remarkable",
      hangout: "kick back",
      vibe: "atmosphere",
      chill: "relax",
      vibe: "atmosphere",
      rock: "excel",
      "kick back": "relax",
      vibe: "atmosphere",
      connect: "link up",
      chill: "unwind",
      vibe: "atmosphere",
    },
    Humorous: {
      "welcome to": "Prepare for the fun",
      questions: "anything you wanna throw at me",
      joke: "gag",
      laugh: "chuckle",
      humor: "wit",
      witty: "clever",
      amusing: "entertaining",
      entertain: "amuse",
      lighthearted: "carefree",
      chuckle: "giggle",
      jest: "quip",
      comical: "funny",
      witty: "humorous",
      laughter: "merriment",
      playful: "frolicsome",
      hilarious: "uproarious",
      joy: "delight",
      prank: "shenanigan",
      whimsical: "fanciful",
      antics: "playfulness",
      wit: "banter",
      comical: "whimsical",
      "laugh-out-loud": "ROFL",
      antics: "shenanigans",
      uproarious: "hilarious",
      wit: "banter",
      whimsy: "playfulness",
    },
    Academic: {
      "welcome to": "Introduction to",
      questions: "queries",
      study: "research",
      discover: "uncover",
      analyze: "examine",
      comprehend: "understand",
      explore: "investigate",
      knowledge: "wisdom",
      understanding: "comprehension",
      educate: "enlighten",
      intellectual: "cerebral",
      theory: "hypothesis",
      observe: "scrutinize",
      learn: "acquire knowledge",
      investigate: "probe",
      thesis: "dissertation",
      scholarly: "academic",
      critical: "analytical",
      experiment: "trial",
      validate: "substantiate",
      hypothesis: "theory",
      methodology: "approach",
      academician: "scholar",
      intellectualism: "erudition",
      literature: "written works",
      academia: "educational community",
      "intellectual property": "ideas",
      doctrine: "belief",
    },
    Poetic: {
      "welcome to": "In the realm of",
      questions: "mysteries",
      beauty: "elegance",
      explore: "wander",
      metaphor: "symbolism",
      enchant: "captivate",
      poetic: "lyrical",
      ethereal: "otherworldly",
      grace: "elegance",
      sublime: "transcendent",
      muse: "inspiration",
      artistry: "creativity",
      celestial: "heavenly",
      serenade: "melody",
      sonnet: "poem",
      verse: "stanza",
      enchanting: "captivating",
      rhythm: "cadence",
      celestial: "heavenly",
      enchantment: "magic",
      lyrical: "melodious",
      "poetic justice": "fairness",
      quill: "feather pen",
      panorama: "landscape",
      reverie: "daydream",
      soliloquy: "monologue",
    },
  };
  const styleMod = styleModifications[selectedStyle] || {};
  const modifiedResponse = replaceTokens(response, styleMod);

  return modifiedResponse;
}

function replaceTokens(response, tokenMap) {
  const modifiedResponse = response.replace(
    new RegExp(Object.keys(tokenMap).join("|"), "gi"),
    (matched) => tokenMap[matched.toLowerCase()]
  );

  return modifiedResponse;
}
