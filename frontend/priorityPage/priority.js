// var stripe = Stripe("pk_test_51OaAZqSJU9EFf2GWPAVpLoTuBxMryK48yAWoFL9xEbywdQUIC3iZhZeAT2yflHZFA4njNXTKgW00kEJGN8VZmV9A00CX7m7CNE");


//         document.getElementById("continue").addEventListener("click", () => {
//             stripe.redirectToCheckout({
//                 lineItems: [{
//                     price: "price_1OaB20SJU9EFf2GW2ntzEHlh",
//                     quantity: 1
//                 }],
//                 mode: "subscription",
//                 successUrl: "https://www.google.com",
//                 cancelUrl: "https://www.yahoo.com"
//             }).then((result) => { alert(result.error.message); });
//         });