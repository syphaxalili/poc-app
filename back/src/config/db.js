const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Configuration pour MongoDB local avec la base de données POC_IA
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/POC_IA';
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully to POC_IA database');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;