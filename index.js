const express = require('express');
const { resolve } = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3010;

app.use(express.static('static'));

//server side values
let taxRate = 5;
let discountPercentage = 10;
let loyalityRate = 2;

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

function calculateTotalPrice(newItemPrice, cartTotal) {
  return parseFloat(newItemPrice) + parseFloat(cartTotal);
}

app.get('/cart-total', (req, res) => {
  const { newItemPrice, cartTotal } = req.query;
  res.send(calculateTotalPrice(newItemPrice, cartTotal).toString());
});

function calculateDiscountedPriceIfHaveMembership(cartTotal, isMembership) {
  cartTotal = parseFloat(cartTotal);
  if (isMembership === 'true') {
    return cartTotal - (cartTotal * discountPercentage) / 100;
  } else {
    return cartTotal;
  }
}

app.get('/membership-discount', (req, res) => {
  const { cartTotal, isMember } = req.query;
  res.send(
    calculateDiscountedPriceIfHaveMembership(cartTotal, isMember).toString()
  );
});

function calculateTax(cartTotal) {
  return (parseFloat(cartTotal) * taxRate) / 100;
}

app.get('/calculate-tax', (req, res) => {
  const { cartTotal } = req.query;
  res.send(calculateTax(cartTotal).toString());
});

function calcualteDeliveryTime(shippingMethod, distance) {
  if (shippingMethod === 'standard' || shippingMethod === 'Standard') {
    return parseFloat(distance) / 50;
  } else if (shippingMethod === 'express' || shippingMethod === 'Express') {
    return parseFloat(distance) / 100;
  } else {
    return 'wrong input!';
  }
}
app.get('/estimate-delivery', (req, res) => {
  const { shippingMethod, distance } = req.query;
  res.send(calcualteDeliveryTime(shippingMethod, distance).toString());
});

function calculateShippingCost(weight, distance) {
  return parseFloat(weight) * parseFloat(distance) * 0.1;
}
app.get('/shipping-cost', (req, res) => {
  const { weight, distance } = req.query;
  res.send(calculateShippingCost(weight, distance).toString());
});

function calculateLoyalityPoint(purchaseAmount) {
  return parseFloat(purchaseAmount) * loyalityRate;
}
app.get('/loyalty-points', (req, res) => {
  const { purchaseAmount } = req.query;
  res.send(calculateLoyalityPoint(purchaseAmount).toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
