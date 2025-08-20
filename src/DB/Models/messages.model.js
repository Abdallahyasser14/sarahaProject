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
        // dorha el waheed when we nedd to get the information of the user who received the message 
        //
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// create the model from the schema
const Message = mongoose.model('Message', messageSchema);

export default Message;



//** relationships in mongoDb are 2 types
// * Parent child relationship
// * => ana wa2ef fein 3nd ely has maslna hena user has messages we el message heya ely fiha el key 
// *  BHDAED EL RELATIONSHIP 3LA HASAB MIN 3AREF MIN I MEAN EN HEAN EL USER MESH GOWAA AY M3LOMA TE2OL TO HIM WHO ARE ITS CHILDS 
// * child parent relationship
//* => HENA EL CHILD 3ANDO MA3LOMA YE2LO MIN EL PARENT
//  */