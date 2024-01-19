// const express = require("express");
// const { auth } = require("../middlewares/auth.middleware");
// const stripe = require('stripe')('pk_test_51OaAZqSJU9EFf2GWPAVpLoTuBxMryK48yAWoFL9xEbywdQUIC3iZhZeAT2yflHZFA4njNXTKgW00kEJGN8VZmV9A00CX7m7CNE');

// const paymentRoute = express.Router()
// paymentRoute.use(auth);

// paymentRoute.post("/payment", async (req, res) => {
//     const payload = req.body;
//     try {
//         document.getElementById("CheckOut").addEventListener("click", () => {
//             stripe.redirectToCheckout({
//                 lineItems: [{
//                     price: payload.price_id,
//                     quantity: 1
//                 }],
//                 mode: "subscription",
//                 successUrl: "https://www.google.com",
//                 cancelUrl: "https://www.yahoo.com"
//             }).then((result) => { alert(result) })
//         })
//     } catch (error) {
//         res.status(400).json({ error });
//     }
// })