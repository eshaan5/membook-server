// starting point of server
// body parser, cors - for cross-origin resource sharing, express - for routing, mongoose - for models, nodemon - for auto-restarting server
// type: module in package.json helps in using import instead of require

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';

const app = express();  // this we do everytime
dotenv.config();  // this we do everytime

app.use(bodyParser.json({ limit: '30mb', extended: true }));  // images
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));  // to accept the data
app.use(cors());  // to allow cross-origin resource sharing

app.use('/posts', postRoutes);  // every route in postRoutes will start with /posts - this is a middleware - should be after cors always
app.use('/user', userRoutes);  // every route in userRoutes will start with /user - this is a middleware - should be after cors always

const CONNECTION_URL = process.env.CONNECTION_URL;  // GOT THIS URL FROM MONGODB ATLAS - CLUSTER - CONNECT - CONNECT YOUR APPLICATION
const PORT = process.env.PORT || 5000;  // process.env.PORT is for heroku

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })  // connecting to the database, second parameter is to avoid warnings
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))  // if connection is successful, then start the server
    .catch((error) => console.log(error.message));  // if connection is not successful, then log the error