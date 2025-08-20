import mongoose from 'mongoose';

// create the schema for the message
const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
 
    receiverId: { //? this is the id of the user who received the message fd2a relationship `reference document`
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        ref:"User" //? this is the name of the collection in the database that the model is based on
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// create the model from the schema
const Message = mongoose.model('Message', messageSchema);

export default Message;
