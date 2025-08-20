import Message from "../../../DB/Models/messages.model.js";
import User from "../../../DB/Models/user.model.js";
export const sendMessageService = async (req, res) => {
    try {
        const {content,receiverId}=req.body;
       
        const receiver=await User.findById(receiverId);
        if(!receiver){
            return res.status(404).json({message:"Receiver not found"});
        }

         const message=await Message.create({content,receiverId});
        return res.status(200).json({message});
        
    }
    catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
    
export const getMessagesService = async (req, res) => {
    try {
        const {receiverId}=req.body;
        const messages=await Message.find({receiverId}).populate({

            path:"receiverId", // this is the name of the field in the message model that references the user model
            select:"firstName lastName" // this is the fields that we want to include in the response
        });
        return res.status(200).json({messages});
    }
    catch (error) {
        console.error('Error getting messages:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}