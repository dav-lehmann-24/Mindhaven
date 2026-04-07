const tagController = require('../../controllers/tagController');

describe('Tag Controller', () => {

  test('getMoodTrend exists', () => {
    expect(tagController.getMoodTrend).toBeDefined();
  });

  test('getTagsByMood exists', () => {
    expect(tagController.getTagsByMood).toBeDefined();
  });

});