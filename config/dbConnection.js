const { default: mongoose } = require("mongoose")

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_DB_URL}`);
        console.log('database is connected');
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbConnect