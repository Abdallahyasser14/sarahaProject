import User from "../../../DB/Models/user.model.js";
import { decrypt, encryptData,assymetricEncryption,assymetricDecryption} from "../../../Utils/encryption.utilis.js";
import bcrypt from 'bcrypt';
import { hashSync } from 'bcrypt';
import { sendEmail } from "../../../Utils/send-email.utils.js";
import { customAlphabet,nanoid } from "nanoid";    
import { EventEmitter} from 'events';
import {eventEmitter} from "../../../Utils/send-email.utils.js";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";
import {verifyToken} from "../../../Utils/tokens.utils.js";
import {generateToken} from "../../../Utils/tokens.utils.js";
import {BlacklistedTokens} from "../../../DB/Models/black-listed-tokens.model.js";
const OTP_generate = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);
export const addUser = async (req, res) =>
{
    const otp=OTP_generate();

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

//!     *session 10 week 2* encryption and decryption :
//We will encrypt the phnoe number when the user sign up and decrypt it when the user retrieve or view their profile
// here we will encypt the phone number before saving it to the database
// we can encrpyt anything not the phone numnber only so it is a common function so we can create a utility function to encrypt and decrypt the phone number or any field
// use utilites files

//const encryptPhoneNumber=encryptData(phoneNumber);
const encryptPhoneNumber= assymetricEncryption(phoneNumber);

//!     *session 10 week 2* part2 hash password :
// we will hash the password before saving it to the database
// we can use bcrypt or any other library to hash the password
// we will use bcrypt to hash the password and compare it with the password in the database

const hashPassword=bcrypt.hashSync(password,+process.env.SALT_ROUNDS);
                                  //10 is the number of salt rounds

// or we can use async function
//const hashPassword=await bcrypt.hash(password,10);

        const user= await User.create({
firstName,
lastName,
age,
email,  
password:hashPassword,
gender,
phoneNumber:encryptPhoneNumber,
otps:{confirmation:hashSync(otp,+process.env.SALT_ROUNDS)}, //? we will hash the otp before saving it to the database and ensure integrity of the otp
isConfirmed:false
        });
 


        // !  week 11 session 1 (send email)

        eventEmitter.emit("sendEmail",{
            to:email,
            subject:"User added successfully",
            html:`User added successfully, your OTP is ${otp}`,
            //? attachments is an array of objects that contains the file name, path (law 3awez teb3at sowar aw files) bethot el esm we el path
            // attachments:[{
            //     filename:"user.png",
            //     path:"./user.png",
            //    
            // }]
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
export const confirmUser = async (req, res) =>
{
    try 
    {
        const {email, otp} = req.body;
        const user = await User.findOne({ email,isConfirmed:false }); // find the user by email and isConfirmed false 
        if (!user) {
            return res.status(404).json({ message: 'User not found or already confirmed' });
        }
        const isOtpMatched = bcrypt.compareSync(otp, user.otps?.confirmation); // compare the otp with the hashed otp in the database 
        if (!isOtpMatched) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
        // update the user
        user.isConfirmed = true;
        user.otps.confirmation = undefined; // remove the otp from the database not just null remove it

        await user.save();
        return res.status(200).json({ message: 'User confirmed successfully' });
    }
    catch (error) {
        console.error('Error confirming user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const signInUser = async (req, res) =>
{
    try 
    {
        const {email, password} = req.body;

        // Validate the input data
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches (assuming you have a method to compare passwords)
        // if (user.password !== password) {
        //     return res.status(401).json({ message: 'Invalid password' });
        // }
      
      
        //! session 10 week 2 part2 hash password :
        // compare the password with the hash password
        const isPasswordMatched=bcrypt.compareSync(password,user.password);  // compareSync is a method that compares the password with the hash password saved in the database
        if (!isPasswordMatched) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // If everything is fine, return the user data (excluding password)
        const { password: _, ...userData } = user.toObject();
        

        //! session 10 week 2 part1 encryption :
        // decrypt the phone number
        const decryptPhoneNumber=assymetricDecryption(user.phoneNumber);
        userData.phoneNumber=decryptPhoneNumber;
//! session 11 week 2 authentication
// generate the token for the user
const accesstoken=generateToken({id:user._id,email:user.email},process.env.JWT_SECRET_KEY, // return the token in string
                                                          //? secret key using in jwt.sign() is the same as the one in jwt.verify()

                                                          //? options for the token
                                                          {issuer:"saraha",subject:"user",expiresIn:process.env.ACCESS_TOKEN_EXPIRATION,jwtid:uuidv4()}
                                                                                                        //? jwtid is a unique identifier for the token to revoke it in a while
        );

//! session 12 week 1 authentication 
//? generate the refresh token for the user el front haykalem el api bi lma ye5las el time
        const refreshtoken=generateToken({id:user._id,email:user.email},process.env.JWT_SECRET_KEY, // return the token in string
                                                          //? secret key using in jwt.sign() is the same as the one in jwt.verify()

                                                          //? options for the token
                                                          {issuer:"saraha",subject:"user",expiresIn:process.env.REFRESH_TOKEN_EXPIRATION,jwtid:uuidv4()}
                                                                                                        //? jwtid is a unique identifier for the token to revoke it in a while
        );
        return res.status(200).json({ 
            message: 'User signed in successfully', 
              //! session 11 week 2 authentication instead of returning the user data we will return the token

              //? generate the token for the user

              //**
              //* there are 2 types of tokens
              //* 1- access token : get the logged in user data . 3shan a3raf ma3lomat el user ely 3amel login now
              //* 2- refresh token : get a new access token after the access token expires or **revoked** (ahsan ma t5ly el user y3tla3 we y3ml login again to get a new access token)
              //  */  

              //! we have 2 steps
              //! 1- generate the token => jwt.sign()

              //! 2- return the token =>jwt.verify()  betfok el token lma yerga3 men el frontend

              //!? jwt.sign() takes 3 parameters
              //!? 1- payload : the data we want to store in the token  
              //!? 2- secret : the secret key to sign the token : your signature key same as the one in the jwt.verify() when u decrypt the token this is the symmetric encryption key
              //!? 3- options : the options for the token : like expiration time

              //!? jwt.verify() takes 2 parameters
              //!? 1- token : the token to verify
              //!? 2- secret : the secret key to verify the token

            accesstoken,
            refreshtoken
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
export const UpdateService = async (req, res) => {  
    // ye3ml update lel user ay haga ela el password because it is sensitive data and has different logic
    try {


       
        //! week 11 session2 authentication
        //const { userId } = req.params; // Assuming userId is passed as a URL parameter
        // it isnt safe to make this step without authentication so we will use the user id from the token 
        // en el user ha3yml login wenta testanteg men el token el user el mafrood el front fel update api hayb3at lik el token
    //     const {accesstoken}=req.headers;
    //     const decodedToken=verifyToken(accesstoken,process.env.JWT_SECRET_KEY); //? verify the token
    //     const userId=decodedToken.id; //? get the user id from the token
 
    // const blaclistfind=await BlacklistedTokens.findOne({tokenId:decodedToken.jti});
    //     if(blaclistfind){
    //         return res.status(401).json({message:"Token is blacklisted"});
    //     }
 
    const userId=req.loggedInUser._id;
        const { firstName, lastName, age,email,gender } = req.body;
        const user =await User.findById(userId); // Find the user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user);
    

     
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
        res.status(500).json({ message: 'Internal server error',error });
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
        const userId=req.loggedInUser._id;  // gay men el auth middleware 
        // Assuming userId is passed as a URL parameter

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
    try
    {
     let users=await User.find()
     users=users.map((user)=> 
    { return{
        ...user._doc,
        phoneNumber:assymetricDecryption(user.phoneNumber)
     }
    }
    )
res.status(200).json({users})
}

    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }


}


export const forgetPasswordUser =async(req,res)=>
{
    try{
        const {email}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const otp=generateOTP();
        user.otps.resetPassword=otp;
        await user.save();
      eventEmitter.emit("sendEmail",{
        to:user.email,
        subject:"Forget Password",
        html:`<p>your otp is ${otp}</p>`
    })
    res.status(200).json({message:"Otp sent successfully"})
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const confirmForgetPasswordUser =async(req,res)=>
{
    try {
        const {email,otp,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isOtpMatched=bcrypt.compareSync(otp,user.otps?.resetPassword);
        if(!isOtpMatched){
            return res.status(401).json({message:"Invalid OTP"});
        }
        user.password=bcrypt.hashSync(password,10);
        user.otps.resetPassword=undefined;
        await user.save();
        res.status(200).json({message:"Password updated successfully"});

    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


//? blacklisted tokens
// when user logs out we will add the token to the blacklisted tokens array so when we verify the token we will check if the token is in the blacklisted tokens array
// we will create a blacklist model to store the blacklisted tokens we will store userid and token id and token expiration date because if it is expired we will remove it from the blacklisted tokens array
// we must use redis(like firebase) to store the blacklisted tokens because it is faster than mongodb
// we store the blacklisted tokens because if the user catches them they can use them to access the api and do actions on behalf of the user 
export const logoutUser =async(req,res)=>

   
    {
       
        try {
            // const {accesstoken}=req.headers;
            // const decodedToken=verifyToken(accesstoken,process.env.JWT_SECRET_KEY); //? verify the token
            // const userId=decodedToken.id; //? get the user id from the token
            const userId=req.loggedInUser._id; //! men el auth middleware 
            const user=await User.findById(userId);
            if(!user){
                return res.status(404).json({message:"User not found"});
            }
            const blacklistedToken=new BlacklistedTokens({
             
                tokenId:req.tokenId,
                expirationDate:new Date(req.expirationDate*1000) // convert the expiration date to milliseconds
                   //? add the token to the blacklisted tokens array best practice to add it in reddis
            })
            await blacklistedToken.save();
          
            
            
        
            res.status(200).json({message:"User logged out successfully"});
        }
        catch (error) {
            console.error('Error logging out user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }



    }


export const RefreshTokenService =async(req,res)=>  // refresh token service takes the refresh token from the request and returns a new access token
{
    try {
        const {refreshtoken}=req.headers;
        const decodedToken=verifyToken(refreshtoken,process.env.JWT_SECRET_KEY); //? verify the token
        const accesstoken=generateToken({id:decodedToken.id,email:decodedToken.email},process.env.JWT_SECRET_KEY, // return the token in string
                                                          //? secret key using in jwt.sign() is the same as the one in jwt.verify()

                                                          //? options for the token
                                                          {issuer:"saraha",subject:"user",expiresIn:process.env.ACCESS_TOKEN_EXPIRATION,jwtid:uuidv4()}
                                                                                                        //? jwtid is a unique identifier for the token to revoke it in a while
        );
    
  
      
        
        
    
        return res.status(200).json({message:"User logged out successfully",accesstoken});
    }
    catch (error) {
        console.error('Error refreshing token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}