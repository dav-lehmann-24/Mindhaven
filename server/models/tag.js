const db = require('../config/database');
const POSITIVE_TAGS = [
  "happy","joyful","excited","cheerful","optimistic","content","grateful",
  "proud","hopeful","calm","relaxed","peaceful","relieved","satisfied",
  "balanced","motivated","inspired","confident","productive","energetic"
];

const NEGATIVE_TAGS = [
  "sad","down","lonely","hopeless","disappointed","stressed","overwhelmed",
  "anxious","worried","angry","frustrated","annoyed","irritated","tired",
  "exhausted","drained","burnt out"
];

const NEUTRAL_TAGS = [
  "okay","neutral","fine","normal","indifferent","reflective","unsure","numb","blank"
];

function classifyMood(tag) {
  if (POSITIVE_TAGS.includes(tag)) return "positive";
  if (NEGATIVE_TAGS.includes(tag)) return "negative";
  if (NEUTRAL_TAGS.includes(tag)) return "neutral";
  return "unknown";
}

function analyzeTrend(journals) {
  let positive = 0, negative = 0, neutral = 0;

  journals.forEach(j => {
    const mood = classifyMood(j.tags);
    if (mood === "positive") positive++;
    if (mood === "negative") negative++;
    if (mood === "neutral") neutral++;
  });

  const total = journals.length;

  if (total === 0) return { trend: "none", message: null };

  if (negative >= total * 0.7) {
    return {
      trend: "negative",
      message: "💙 You've been feeling quite low recently. Try reaching out for support."
    };
  }

  if (positive >= total * 0.7) {
    return {
      trend: "positive",
      message: "🌟 You've been consistently positive! Spread the joy with someone."
    };
  }

  return {
    trend: "mixed",
    message: null
  };
}

module.exports = {
  POSITIVE_TAGS,
  NEGATIVE_TAGS,
  NEUTRAL_TAGS,
  classifyMood,
  analyzeTrend
};
