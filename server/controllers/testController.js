// controllers/testController.js
exports.testRoute = (req, res) => {
  console.log('✅ Test controller reached!');
  res.status(200).json({ message: '✅ Test route is working fine!' });
};
