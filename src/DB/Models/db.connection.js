import mongoose from 'mongoose';


// how to connect to the database even if it didnt there it will create it for you when u make queries
// this is the connection to the database
const dbConnection = async () => {
try 
{
    // Connect to the MongoDB database in 30 seconds by default
    await mongoose.connect("mongodb://localhost:27017/sarahah_app",{serverSelectionTimeoutMS: 30000});
                                                                     // u can change it but the default is 30 seconds 
    
console.log('Database connected successfully');
}

catch (error)

{
    console.error('Error connecting to the database:', error);
    throw new Error('Database connection failed');
}
}

export default dbConnection;