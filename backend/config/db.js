const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🟢 MongoDB Conectado: ${conn.connection.host}`);
      } catch (error) {
        console.error(`🔴 Error en conexión: ${error.message}`);
        process.exit(1);
      }
    };
    

module.exports = connectDB;

