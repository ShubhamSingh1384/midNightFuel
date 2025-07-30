const { verifyToken } = require("../../config/jwt.js");
const ordersModel = require("../../model/ordersModel.js");
const productModel = require("../../model/productModel.js");
const userModel = require("../../model/userModel.js");
const dotenv = require("dotenv");
dotenv.config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);

    const productIndex = user.cart.findIndex(
      (product) => product.id == productId
    );

    if (productIndex > -1) {
      user.cart[productIndex].quantity += 1;
      user.markModified("cart");
    } else {
      user.cart.push({ id: productId, quantity: 1 });
    }

    await user.save();

    res.json({ message: "Product added to cart", success: true });
  } catch (err) {
    console.error("Error is:", err);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const removeCartItems = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;
    const user = await userModel.findById(userId);

    const productIndex = user.cart.findIndex(
      (product) => product.id == productId
    );
    if (productIndex > -1) {
      user.cart.splice(productIndex, 1);
      await user.save();
      res.json({ message: "Product removed from cart", success: true });
    } else {
      res.json({ message: "Product not found in cart", success: false });
    }
  } catch (error) {
    console.error("Error is:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCartItems = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.totalStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.totalStock} items available in stock`,
      });
    }

    const productIndex = user.cart.findIndex(
      (product) => product.id == productId
    );

    if (productIndex > -1) {
      user.cart[productIndex].quantity = quantity;
      user.markModified("cart");
    } else {
      user.cart.push({ id: productId, quantity });
    }

    await user.save();

    res.json({ message: "Product updated in cart", success: true });

  } catch (err) {
    console.error("Error is:", err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    const cartData = user.cart;
    res.send({ success: true, cartData });
  } catch (error) {
    console.error("Error is:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProductQuantity = async (item) => {
  const {sellerId, productId, quantity} = item;
  try {
    await productModel.findOneAndUpdate(
      {_id: productId, sellerId },
      { $inc:{totalStock: -quantity} }
    );
  } catch (error) {
    console.log(error);
    res.json({
      success:false,
      message:"Error in update Product quantity"
    })
  }
};

const orderplaced = async (req, res) => {
  const { cartData, address } = req.body;
  const userId = req.userId;
  // console.log(req.body);

  try {
    const user = await userModel.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const commonDetail = {
      userId: userId,
      address: address,
      paymentMethod: address?.paymentMode || "COD",
      orderStatus: false,
      orderDate: new Date(),
    };

    // Function to get product details
    async function findProductDetails(id) {
      const product = await productModel.findById(id);
      return {
        price: product ? product.price : 0,
        sellerId: product ? product.sellerId : null,
        productName: product ? product.productName : null,
      };
    }

    // Resolve product details with Promise.all
    const order = [];
    for (const element of cartData) {
      const product = await productModel.findById(element.id);
      order.push({
        userId: userId,
        address: address,
        paymentMethod: address?.paymentMode || "COD",
        orderStatus: false,
        orderDate: new Date(),
        productId: element.id,
        orderAmount: product ? product.price * element.quantity : 0,
        sellerId: product ? product.sellerId : null,
        productName: product ? product.productName : null,
        quantity: element.quantity,
      });
    }
    // Save orders to database
    const savedOrders = await ordersModel.insertMany(order);

    //  Update product Quantity after Orderplaced
    const orderDetails = [];
    order.map((items) => {
      const obj = {
        sellerId: items.sellerId,
        productId: items.productId,
        quantity: items.quantity,
      };
      orderDetails.push(obj);
    });
    
    // Empty the user's cart
    await userModel.findByIdAndUpdate(userId, { cart: [] });
    for (const item of orderDetails) {
      await updateProductQuantity(item);
    }
    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      orders: savedOrders,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

const onlineOrderPlaced = async (req, res) => {
  const { cartData, address } = req.body;
  const userId = req.userId;
  // console.log(req.body);

  try {

    const user = await userModel.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const commonDetail = {
      userId: userId,
      address: address,
      paymentMethod: address?.paymentMode || "COD",
      orderStatus: false,
      orderDate: new Date(),
    };

    // Function to get product details
    async function findProductDetails(id) {
      const product = await productModel.findById(id);
      return {
        price: product ? product.price : 0,
        sellerId: product ? product.sellerId : null,
        productName: product ? product.productName : null,
      };
    }

    // Resolve product details with Promise.all
    const order = [];
    for (const element of cartData) {
      const product = await productModel.findById(element.id);
      order.push({
        userId: userId,
        address: address,
        paymentMethod: address?.paymentMode || "COD",
        orderStatus: false,
        orderDate: new Date(),
        productId: element.id,
        orderAmount: product ? product.price * element.quantity : 0,
        sellerId: product ? product.sellerId : null,
        productName: product ? product.productName : null,
        quantity: element.quantity,
      });
    }

    // Save orders to database
    const savedOrders = await ordersModel.insertMany(order);
    const orderDetails = [];
    order.map((items) => {
      const obj = {
        sellerId: items.sellerId,
        productId: items.productId,
        quantity: items.quantity,
      };
      orderDetails.push(obj);
    });
    
    // Empty the user's cart
    await userModel.findByIdAndUpdate(userId, { cart: [] });
    for (const item of orderDetails) {
      await updateProductQuantity(item);
    }
    const { origin } = req.headers;
    const line_items = await Promise.all(
      cartData.map(async (item) => {
        const product = await productModel.findById(item.id);
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.productName,
            },
            unit_amount: product.price * 100, // Convert to paisa
          },
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderId=${commonDetail.userId}`,
      cancel_url: `${origin}/verify?success=false&orderId=${commonDetail.userId}`, // Redirect on cancel
    });

    return res.status(200).json({
      success: true,
      message: "Stripe session created",
      session_url: session.url,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

const orders = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log(userId);
    const user = await userModel.findById(userId);
    const orders = await ordersModel.find({ userId: userId });
    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

const verifyStripe = async (req, res) => {
  const { success } = req.body;
  const userId = req.userId;
  try {
    if (success) {
      await userModel.findByIdAndUpdate(userId, { cart: [] });
      return res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  removeCartItems,
  updateCartItems,
  getUserCart,
  orderplaced,
  orders,
  onlineOrderPlaced,
  verifyStripe,
};
