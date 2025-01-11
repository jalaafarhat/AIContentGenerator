const mongoose = require("mongoose");
//username:jalaa
//password:*********f

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://jalaa:091274jf@aicontentgenerator.h0kto.mongodb.net/AI-content?retryWrites=true&w=majority&appName=AIContentGenerator"
    );
    console.log(`mongodb connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to mongodb ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
