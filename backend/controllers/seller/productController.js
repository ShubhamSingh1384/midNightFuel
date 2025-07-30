const { authentication } = require("../../middleware/authMiddleware");
const ordersModel = require("../../model/ordersModel");
const Product = require("../../model/productModel");
const SelerModel = require("../../model/sellerModel");



const addProduct = async (req, res) => {
  try {
    const { sellerId } = req.user;
    // console.log(sellerId);

    const { price, quantity, name } = req.body;

    if (!sellerId || !price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "insufficient Data",
      });
    }
    const userDetails = await SelerModel.find({ _id: sellerId });
    // console.log("user details " , userDetails);
    const { hostel, room } = userDetails[0];
    const newAddedProduct = new Product({
      productName: name,
      sellerId,
      price,
      totalStock: quantity,
      hostelName: hostel,
      roomNo: room,
    });
    // console.log(newAddedProduct);

    await newAddedProduct.save();

    res.status(200).json({
      success: true,
      message: "Product added Successfully",
      data: newAddedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occur",
    });
  }
};

const editProduct = async (req, res) => {
  // console.log("edit called");
  try {
    const { productId } = req.params;
    const { price, quantity } = req.body;

    if (!price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "insufficient Data",
      });
    }

    let findProduct = await Product.findOne({ _id: productId });
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    findProduct.price = price || findProduct.price;
    // findProduct.quantity = quantity || findProduct.quantity;
    findProduct.totalStock = quantity || findProduct.totalStock;

    await findProduct.save();

    res.status(200).json({
      success: true,
      data: findProduct,
      message: "product updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Occur",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findByIdAndDelete({ _id: productId });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    } else {
      return res
        .status(200)
        .json({ message: "Product deleted successfully", success: true });
    }
  } catch (error) {
    console.log("delete Product : ", error);
    res.status(400).json({
      success: false,
    });
  }
};

const fetchProduct = async (req, res) => {
  console.log("fetch Product called ");
  try {
    const { sellerId } = req.user;
    console.log("fetch product details ", req.user);
    console.log("selled is fetch ", req.user.sellerId)

    const products = await Product.find({ sellerId });

    // console.log(products)
    if (!products) {
      return res
        .status(400)
        .json({ message: "No products found", success: false });
    } else {
      return res.status(200).json({ data: products, success: true });
    }
  } catch (error) {
    console.log("fetch Product : ", error);
    res.status(400).json({
      success: false,
    });
  }
};

const fetchAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res
        .status(400)
        .json({ message: "No products found", success: false });
    }
    return res.status(200).json({ data: products, success: true });
  } catch (error) {
    console.log("fetchAllProduct : ", error);
    res.status(400).json({
      success: false,
    });
  }
};
const allorders = async (req, res) => {
  // console.log(req);

  try {
    const { sellerId } = req.user;
    const orders = await ordersModel.find({ sellerId });
    if (!orders) {
      return res
        .status(400)
        .json({ message: "No orders found", success: false });
    }
    return res.status(200).json({ data: orders, success: true });
  } catch (error) {
    console.log("allorders : ", error);
    res.status(400).json({
      success: false,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    // Update order status
    const updatedOrder = await ordersModel.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Fetch productId and quantity after order update
    const order = await ordersModel.findOne({ _id: req.params.id });
    if (!order) {
      return res.status(404).json({ message: "Order details not found" });
    }
    const { productId, quantity } = order;

    // Update product quantity function
    const updateProductQuantity = async (productId, quantity) => {
      return await Product.updateOne({ _id: productId }, { $inc: { quantity: -quantity } });
    };

    await updateProductQuantity(productId, quantity);

    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = {
  addProduct,
  editProduct,
  fetchProduct,
  deleteProduct,
  fetchAllProduct,
  allorders,
  updateOrderStatus,
};
