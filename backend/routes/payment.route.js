
require("dotenv").config();
const express = require("express");
const { auth } = require("../middlewares/auth.middleware");

const paymentRouter = express.Router();

// paymentRouter.use(auth);


const stripe = require('stripe')("sk_test_51OaAZqSJU9EFf2GWhLQSpolsUd4LXyrYZtnWBaTT7gL5h7DBUZ4aLYdxre9tRSjQbw9oib16YUc5xdR3bhJVy1LV00z0mqlIpz")

paymentRouter.post('/', async (req, res) => {
  try {

    const { product } = req.body;

    const lineItems = product.map((product) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.plan,
        },
        unit_amount: product.price * 100
      },
      quantity: product.qnty
    }))

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: "https://www.google.com",
      cancel_url: "https://www.yahoo.com",
    });

    res.json({ id: session.id })

  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

module.exports = {
  paymentRouter,
};
