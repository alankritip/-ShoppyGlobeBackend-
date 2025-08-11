const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper: find or create user's cart
async function getUserCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

// POST /cart (add product to cart)
exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await getUserCart(userId);
    let item = cart.items.find(i => i.productId.equals(productId));
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();

    res.status(200).json({message: "Cart Updated with Logged-in user"},cart);
  } catch (err) {
    next(err);
  }
};

// PUT /cart/:productId (update quantity)
exports.updateCartQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be >= 1' });

    let cart = await getUserCart(userId);
    let item = cart.items.find(i => i.productId.equals(req.params.productId));
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    item.quantity = quantity;
    await cart.save();
    res.json({ message: "the cart with the item's quantity updated"},cart);
  } catch (err) {
    next(err);
  }
};

// DELETE /cart/:productId
exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let cart = await getUserCart(userId);
    cart.items = cart.items.filter(i => !i.productId.equals(req.params.productId));
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};
