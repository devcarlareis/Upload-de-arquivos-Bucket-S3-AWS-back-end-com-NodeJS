require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const path = require("path");
const cors = require("cors");

const app = express();

/**
 * Databse setup
 */
    mongoose
        .connect(process.env.MONGOURL, {useNewUrlParser: true })
          mongoose.connection.on('error', () => console.error('connection error:'))
          mongoose.connection.once('open', () => console.log('database connected'))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use(require('./routes'))

app.listen(process.env.SERVER_PORT)