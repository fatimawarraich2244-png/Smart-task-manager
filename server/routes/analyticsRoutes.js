const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  createFocusSession,
  getFocusSessions,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All analytics routes are protected
router.use(protect);

router.get('/', getAnalytics);
router.route('/focus').get(getFocusSessions).post(createFocusSession);

module.exports = router;
