import Message from "../../../DB/Models/messages.model.js";
export const sendMessageService = async (req, res) => {
    try {
        const {content,receiverId}=req.body;
        const message=await Message.create({content,receiverId});
        
        return res.status(200).json({message});
        
    }
    catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
    