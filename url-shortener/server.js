require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const shortUrl = require('./model/shortUrl');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hsyjc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', async (req, res) => {
  const shortUrls = await shortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/addURl', async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  let Url = await shortUrl.findOne({ short: req.params.shortUrl });
  if (Url == null) {
    res.sendStatus(404);
  }
  Url.clicks++;
  Url.save();
  res.redirect(Url.full);
});

app.listen(process.env.PORT);
