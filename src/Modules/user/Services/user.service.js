import User from "../../../DB/Models/user.model.js";
import { decrypt, encryptData } from "../../../Utils/encryption.utilis.js";

export const addUser = async (req, res) =>
{

    try 
    {   const{ firstName, lastName, age,email, password,gender,phoneNumber } = req.body;
        // Validate the input data

        // lazem ne3ml find el user by email to check if the user already exists abl ma ne3ml create 3shan el error yegy menna mesh men el database

        /**
         ** to find a user by email
         * *  find => to find all documents that match the query  . returns an array of documents if found or an empty array if not found
         * * findOne  => to find one document only  => returns a single document or null if not found
         * * findById : to find by id => _id only one condition is the id the fastest . returns a single document or null if not found
         */
// we 3andena conition tany unique 3la el firstName and lastName so we will cehck the email or the combination of firstName and lastName both if any of them exists => error
         const isEmailExists = await User.findOne({ 
            
             $or:[{email: email}, {firstName: firstName, lastName: lastName}]
                                                    //and
        });
         if (isEmailExists)
         {
            return res.status(409).json({ message: 'Email already exists' });
         }


         // if it pass the check so add user to the database 
         /**
          * * create => to create a new document in the database
          * *save => to save the document to the database 
          *  3shan ashta8al 3la el save lazem teb2a haga rag3a men el database 3andy 2 ways 
          *   1- a3ml instance of the model and then call the save method on it 
          *      => const userinstance = new User({ firstName, lastName, age, email, password,gender });
          *      keda 3amalt instance of the model 3la el code bs lesa lazem save it to the database
          *      => await userinstance.save();
          * adva
          *   2- find the document and then call the save method on it
          * *insertMany => to insert multiple documents at once (bulk insert array of documents)
          *
          */

// session 10 week 2 :
//We will encrypt the phnoe number when the user sign up and decrypt it when the user retrieve or view their profile
// here we will encypt the phone number before saving it to the database
// we can encrpyt anything so it is a common function so we can create a utility function to encrypt and decrypt the phone number\
// use utilites files

const encryptPhoneNumber=encryptData(phoneNumber);
console.log("kdjkfdjfkdj  ",encryptPhoneNumber)
        const user= await User.create({
firstName,
lastName,
age,
email,  
password,
gender,
phoneNumber:encryptPhoneNumber
        });
    return res.status(201).json({

        message: 'User added successfully',user
    
    }
    );
    }


    catch (error) 
    {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const signInUser = async (req, res) =>
{
    try 
    {
        const { email, password } = req.body;

        // Validate the input data
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches (assuming you have a method to compare passwords)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // If everything is fine, return the user data (excluding password)
        const { password: _, ...userData } = user.toObject();
        
        return res.status(200).json({
            message: 'User signed in successfully',
            user: userData
        });
    } catch (error) {
        console.error('Error signing in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

/**to update the user
 ** save => find first then update the fields and then save the document
 ** updateOne => to update one document in the database                 
 ** updateMany => to update multiple documents at once (bulk update)
 both updateOne and updateMany return object in it  the number of documents that were updated modified count so we can use it to check if the update was successful or not
 * * findByIdAndUpdate => to find a document by id and update it
 * * findOneAndUpdate => to find one document that matches the query and update it
 */
export const UpdateService = async (req, res) => {  // ye3ml update lel user ay haga ela el password because it is sensitive data and has different logic
    try {
const { userId } = req.params; // Assuming userId is passed as a URL parameter
        const { firstName, lastName, age,email,gender } = req.body;
        const user =await User.findById(userId); // Find the user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    /*  SAVE METHOD
        / Update the user fields with save method
        user.firstName = firstName || user.firstName; // Update only if provided
        user.lastName = lastName || user.lastName;
        user.age = age || user.age;
        
        if (email) {
            / Check if the new email already exists
            const isEmailExists = await User.findOne({email});
        if (isEmailExists && isEmailExists._id.toString() !== userId) {
                return res.status(409).json({ message: 'Email already exists' });
            }
            user.email = email; // Update email only if it doesn't exist
        } 
        user.gender=gender || user.gender;


        await user.save(); // Save the updated user
        return res.status(200).json({
            message: 'User updated successfully',
            user
        });
        */



        /*
     UPDATE ONE METHOD
        / Update the user fields with updateOne method
        const updatedUser = await User.updateOne(
            { _id: userId }, // Find the user by ID
            {// tany object elhagat ely ha3mlha set
                $set: { // momken men 8ir set 3ady
                    firstName: firstName || user.firstName,
                    lastName: lastName || user.lastName,
                    age: age || user.age,
                    email: email || user.email, // Update email only if provided
                }
            
            }
        
        );

        if (updatedUser.modifiedCount === 0) {
            return res.status(400).json({ message: 'No changes made to the user' });
        }
        return res.status(200).json({
            message: 'User updated successfully',
            user: { ...user.toObject(), ...{ firstName, lastName, age, email } } // Return updated user data
        });

*/


    // findByidAndUpdate METHOD
        // Update the user fields with findByIdAndUpdate method
const updatedUser = await User.findByIdAndUpdate(
            userId, // Find the user by ID
            { // Update fields  el object beta3 el hagat ely hai3ml leha update
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                age: age || user.age,
                email: email || user.email, // Update email only if provided

    },{
        new: true, // Return the updated user data  lazem 3shan yeraga3 di fel updated user keda keda haye3ml update
        runValidators: true // Run validation on the updated fields
    });

    // it returns by default the old user data so we need to set the option to return the new user data 
    // it returns null if the user is not found


    res.status(200).json({
            message: 'User updated successfully',
            user: { ...user.toObject(), ...{ firstName, lastName, age, email } } // Return updated user data
        });
}
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// hard delete user

/**
 * 
 * * deleteOne => to delete one only with condition document in the database returns the number of documents deleted
 * * deleteMany => to delete multiple documents at once (bulk delete) returns the number of documents deleted
 * * findByIdAndDelete => to find a document by id and delete it and return it returns the deleted document
 ** * * findOneAndDelete => to find one document that matches the query and delete it and return it 
 */
export const DeleteService = async (req, res) => {
    
    try
    {
        const { userId } = req.params; // Assuming userId is passed as a URL parameter

        // Find the user by ID and delete it
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return a success message
        res.status(200).json({
        
            message: 'User deleted successfully',
            user: deletedUser // Return the deleted user data
        });

    }

    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


}


export const ListUsers =async(req,res)=>
{
     let users=await User.find()
     users=users.map((user)=> 
    { return{
        ...user._doc,
        phoneNumber:decrypt(user.phoneNumber)
     }
    }
    )
res.status(200).json({users})
}

