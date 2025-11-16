const db = require("../config/database");
const { analyzeTrend } = require("../models/tag");

exports.getMoodTrend = (req, res) => {
  const userId = req.user.id;

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const sql = `
    SELECT tags FROM journals
    WHERE user_id = ? AND created_at >= ?
  `;

  db.query(sql, [userId, threeDaysAgo], (err, rows) => {
    if (err) {
      console.error("Trend analysis error:", err);
      return res.status(500).json({ message: "Error analyzing mood trends" });
    }

    const trend = analyzeTrend(rows);

    res.status(200).json({
      trend: trend.trend,
      message: trend.message
    });
  });
};
