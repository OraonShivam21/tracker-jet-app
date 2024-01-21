const express = require('express');

const Quote = require('../models/quotes.models');
const quoteRouter = express.Router();
// Get all quotes
quoteRouter.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const quotes = await Quote.find().limit(limit).skip(startIndex);
  
      const pagination = {};
      if (endIndex < (await Quote.countDocuments().exec())) {
        pagination.next = {
          page: page + 1,
          limit: limit
        };
      }
  
      res.status(200).json({
        msg: "Paginated Quotes",
        quotes: quotes,
        pagination: pagination
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

quoteRouter.post('/add', async (req, res) => {
  try {
    const { text, author } = req.body;
    const newQuote = new Quote({ text, author });
    await newQuote.save();
    res.status(200).json({msg:"Quotes saved"})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = {quoteRouter};
