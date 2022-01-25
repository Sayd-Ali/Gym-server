const Cart = require("../models/Cart.model");
const jwt = require("jsonwebtoken");

module.exports.cartsController = {
  getAllCarts: async (req, res) => {
    try {
      const carts = await Cart.find();
      res.json(carts);
    } catch (error) {
      res.json(error);
    }
  },

  getCartById: async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.params.id });
      res.json(cart);
    } catch (e) {
      res.json(e);
    }
  },

  deleteCart: async (req, res) => {
    const { id } = req.params;
    try {
      const cart = await Cart.findById(id);

      if (req.user.id !== cart.user.toString()) {
        return res.status(401).json("Ошибка. Нет доступа");
      }
      if (cart.user.toString() === req.user.id) {
        await cart.remove();
        return res.json("Удалено");
      }
      return res.status(401).json("Ошибка. Нет доступа");
    } catch (e) {
      res.status(401).json(`Ошибка: ${e.toString()}`);
    }
  },

  addCart: async (req, res) => {
    try {
      const cart = await Cart.create({
        user: req.body.user,
      });
      res.json(cart);
    } catch (e) {
      res.json(e);
    }
  },

  addCartItem: async (req, res) => {
    try {
      await Cart.findByIdAndUpdate(req.params.id, {
        subscription: req.body.subscription,
        trainer: req.body.trainer,
        $push: {
          productsCart: {
            product: req.body.product,
            amount: req.body.amount,
          },
        },
      });

      const cart = await Cart.findById(req.params.id);

      res.json(cart);
    } catch (e) {
      res.json(e);
    }
  },

  deleteCartItem: async (req, res) => {
    try {
      await Cart.findByIdAndUpdate(req.params.id, {
        $pull: {
          productsCart: {
            product: req.body.product,
          },
        },
      });

      const cart = await Cart.findById(req.params.id);

      res.json(cart);
    } catch (e) {
      res.json(e);
    }
  },

  increaseProductAmoutn: async (req, res) => {
    try {
      await Cart.findByIdAndUpdate(req.params.id, {
        productsCart: {
          product: req.body.product,
          $inc: { amount: req.body},
        },
      });

      const cart = await Cart.findById(req.params.id);

      res.json(cart);
    } catch (e) {
      res.json(e);
    }
  },

  cartToken: async (req, res) => {
    try {
      const { subscription, trainer } = req.body;
      const { authorization } = req.headers;
      const [type, token] = authorization.split("");
      if (type !== "Bearer") {
        return res.status(400).json("Неверный тип токена");
      }
      const payload = await jwt.verify(token, process.env.Secret_JWT_KEY);

      const cart = await Cart.create({
        user: payload.id,
        subscription,
        trainer,
      });
      return res.json(cart);
    } catch (e) {
      res.status(401).json("Неверный токен");
    }
  },
};
