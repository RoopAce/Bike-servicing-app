import tryCatch from "../utils/tryCatch.js";
import Spare from "../models/sparepart.model.js";
import APPError from "../utils/Error.js";
import Cart from "../models/cart.model.js";
import { HttpResponse } from "../utils/HttpResponse.js";

export const addToCart = tryCatch(async (req, res, next) => {
  const { id } = req.body; // spare item id
  const user_id = req.user; // user id

  const spare = await Spare.findById(id);
  if (!spare) {
    throw new APPError("Spare not found", 404);
  }

  // Try to find a cart via a user
  const cart = await Cart.findOne({user: user_id});

  let newCart;

  if(!cart){
    newCart = await Cart.create({
      user: user_id,
      item: [id],
    })
  }

  newCart = await Cart.findOneAndUpdate(
    { user: req.user },
    { $push: { items: id } },
    { new: true, runValidators: true }
  );

  return res.send(new HttpResponse("Item added to cart", 200, newCart));
});

export const getCart = tryCatch(async (req, res, next) => {
  //   const carts = await Cart.findOne({ user: req.user });
  const carts = await Cart.findOne({ user: req.user })
    .populate("items")
    .lean(true);

  return res.send(new HttpResponse("Your cart", 200, carts));
});

export const removeItem = tryCatch(async (req, res, next) => {
  console.log("remove item");
  const { id } = req.body;

  if (!id) throw new APPError("No such item found in cart");

  const newCart = await Cart.findOneAndUpdate(
    { user: req.user },
    { $pull: { items: id }, $set: { totalPrice: 0 } },
    { new: true, runValidators: true }
  );
  return res.send(
    new HttpResponse("Item successfully deleted from your cart", 200, newCart)
  );
});
