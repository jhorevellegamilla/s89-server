// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//Routes Middleware
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const userRoutes = require("./routes/user");

// [SECTION] Environment Setup
require('dotenv').config();

// [SECTION] Server Setup
const app = express();

const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.use(express.json());

//[SECTION] Backend Routes 
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/users", userRoutes);

//[SECTION] Database Connection 
mongoose.connect(process.env.MONGODB_STRING);

//Database Connection
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

// [SECTION] Server Gateway Response
if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};