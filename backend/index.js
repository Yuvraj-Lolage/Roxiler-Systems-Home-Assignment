const express = require('express');
const db =  require("./config/db")
const cors = require("cors");
const { userRouter } = require('./routes/user_router');
const { storeRouter } = require('./routes/store_router');
const { ratingRouter } = require('./routes/ratings_router');
const statRouter = require('./routes/admin_router');


const app = express();
const PORT = 3000;

//middlewares
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/stores', storeRouter);
app.use('/api/ratings',ratingRouter);
app.use('/api/admin',statRouter);



app.get('/',(req, res) => {
    const data = db.query('SELECT * FROM user');
    res.send('Hello world!');
})


app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}` 
    );
})
