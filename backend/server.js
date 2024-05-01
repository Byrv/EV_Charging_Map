// server.js
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

const MONGO_URI = MONGO_URI;


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB successfully');
    // Start the server only if MongoDB connection is successful
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});