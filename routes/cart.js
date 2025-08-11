const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.post('/', auth, cartController.addToCart);
router.put('/:productId', auth, cartController.updateCartQuantity);
router.delete('/:productId', auth, cartController.removeFromCart);

module.exports = router;
