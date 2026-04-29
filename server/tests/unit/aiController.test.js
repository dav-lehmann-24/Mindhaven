jest.mock('../../services/localMentalHealthAiService', () => ({
  generateMentalHealthSupport: jest.fn(),
}));

const { generateMentalHealthSupport } = require('../../services/localMentalHealthAiService');
const aiController = require('../../controllers/aiController');

const createRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe('AI Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getMentalHealthSupport returns generated support text', async () => {
    const req = {
      body: {
        message: 'I feel anxious and overwhelmed today.',
      },
    };
    const res = createRes();

    generateMentalHealthSupport.mockResolvedValue('Take a slow breath, ground yourself, and reach out to someone you trust.');

    await aiController.getMentalHealthSupport(req, res);

    expect(generateMentalHealthSupport).toHaveBeenCalledWith('I feel anxious and overwhelmed today.');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      reply: 'Take a slow breath, ground yourself, and reach out to someone you trust.',
      disclaimer: 'This AI offers supportive guidance and is not a substitute for professional mental health care.',
      crisisGuidance:
        'If you are in immediate danger or thinking about harming yourself, call emergency services or a crisis hotline right away.',
    });
  });

  test('getMentalHealthSupport validates empty input', async () => {
    const req = {
      body: {
        message: '   ',
      },
    };
    const res = createRes();

    await aiController.getMentalHealthSupport(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'A non-empty message is required' });
  });
});
