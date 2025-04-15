require('dotenv').config();

const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
const path = require('path')

connectDB();

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


const PORT = process.env.PORT ;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is working');
});


app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
})

