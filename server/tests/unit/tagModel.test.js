const Tag = require('../../models/tag');

describe('Tag Model', () => {
  test('analyzeTrend returns negative trend for mostly negative journals', () => {
    const result = Tag.analyzeTrend([
      { tags: 'sad' },
      { tags: 'anxious' },
      { tags: 'overwhelmed' },
      { tags: 'happy' },
    ]);

    expect(result).toEqual({
      trend: 'negative',
      message: "💙 You've been feeling quite low recently. Try reaching out for support.",
    });
  });
});
