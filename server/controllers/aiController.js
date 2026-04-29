const { generateMentalHealthSupport } = require('../services/localMentalHealthAiService');

const CRISIS_GUIDANCE =
  'If you are in immediate danger or thinking about harming yourself, call emergency services or a crisis hotline right away.';

exports.getMentalHealthSupport = async (req, res) => {
  const { message } = req.body || {};

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'A non-empty message is required' });
  }

  try {
    const reply = await generateMentalHealthSupport(message.trim());

    return res.status(200).json({
      reply,
      disclaimer: 'This AI offers supportive guidance and is not a substitute for professional mental health care.',
      crisisGuidance: CRISIS_GUIDANCE,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || 'Unable to generate AI support at this time',
      details: error.details,
      crisisGuidance: CRISIS_GUIDANCE,
    });
  }
};
