/**
 * to build any model we build first the schema 
 * then we build the model from the schema
 * then we export the model and this is our collection
 * 
 */


import mongoose from 'mongoose';

// create the schema for the user
const userSchema = new mongoose.Schema({
role:{
    type:String,
    enum:["admin","user"],
    default:"user"
},
firstName: {
    type: String,
    required: true,
    minLength: [2,"min length is 2"],  // built in validation with customize message with the error rahther than the default message
    maxLength: 50,
    lowercase: true, // convert to lowercase d2a mesh validator d2a operation abl el save
    trim: true // remove spaces from the start and end   bsrdo operation  d2a mesh validator it will not throw an error it makes operation only
},
lastName: {
    type: String,
    required: true,
    minLength: [2,"min length is 2"],
    maxLength: 50,
    lowercase: true,
    trim: true
},

age :


{
    type: Number,
    required: true,
    min: [0,"age must be greater than or equal to 0"],
    max: [120,"age must be less than or equal to 120"],
    index : true // create an index on the age field for faster queries bs howa haye3ml leih esm men nafso
// index on path level because we are creating an index on the age field we fi tari2a tanya we can create an index on the schema level nfs el haga 
    // index :{
    //     name: "age_index", // name of the index  keda law 3awez asmy el index
    // }
},
gender :
{
    type: String,
    enum :["male","female"],
    required: true,
    default:"male", // default value if the user didn't provide it
},
email: {
    type: String,
    required: true,
    unique: true, // unique index on the email field we heya bte3ml index automatically we heya bte3ml esm lei law 3awez te3ml name enta e3mlo bel tari2a ely fo2
    lowercase: true, // convert to lowercase
    trim: true, // remove spaces from the start and end
    
},
password: {
    type: String,
    required: true,
    minLength: [6,"min length is 6"],
   // maxLength: 50,
    select: false ,// this field will not be returned in the response by default,
   
},

phoneNumber: {
    type: String,
    required: true,
  //  unique: true, // unique index on the phoneNumber field
    trim: true, // remove spaces from the start and end
    set(value) {
        // this is a setter function it will be called when the user saves the phone number
        // we can use it to encrypt the phone number before saving it to the database
        return value; // for now we will just return the value as it is
    }

},
otps:{
    confirmation:String,
    resetPassword:String,

},
isConfirmed:{
    type:Boolean,
    default:false
}




}
    // {} el object el tany el options b2a w keda 
    ,
    {
        toObject:
        {
            virtuals: true, // this will include the virtual fields in the response when we call toObject on the model instance
        },

        toJSON:
        {
            virtuals: true, // this will include the virtual fields in the response when we call toJSON on the model instance
         
        },
        timestamps: true, // this will add createdAt and updatedAt fields to the schema automatically
        // law 3awez a3ml virtual columns we can do it here
        // virtuals: true, // this will add virtual fields to the schema automatically that will not be saved to the database and be calculated on the fly like first name and last name = name
        virtuals : // betigy wa2t el response ya3ni men 8ir ma tetlob mesh zy el models 

        {
            fullName:
            {
                get() { // this is a getter function it will be called when the user accesses the fullName field
                    // we can use it to return the full name of the user
                    // d2a mesh 3awez a3ml set function because we don't need to set the full name we just need to get it
                    return `${this.firstName} ${this.lastName}`;
                }
            }
        }, // el virtuals msh hateshtagal 8ir lazem te3ml toObject aw toJSON method in the model to include the virtuals in the response mesh hatet3mal by default  

        
        methods: { // this is an object that will contain the methods of the model
            // we can add custom methods to the model here
            // these methods will be available on the instances of the model b3d ma te3ml el schema we menha tcreate el model
            // we dol hatlai2hom m3 el default model and this make it easy to use in the apis
            getFullName() {
                return `${this.firstName} ${this.lastName}`;
            }
        }
    }  




);

// compund index on firstName and lastName schema level
userSchema.index({firstName: 1, lastName: 1}, {unique: true}); // create a unique index on the firstName and lastName fields
// this will make sure that the combination of firstName and lastName is unique in the database


/* * 
 * el model haib2a gowaa default methods zy create, find, findById, findOne, update, delete,save, etc.
* u can add custom methods fel object beta3 el objects mehods ;{
    customMethod() {
         custom method logic
    }
 * 
    we can use them when we create a user per exmple
 */




//** virtuals 3shan 3mlna relationship between user and message bs el user ma3yrffsh el messages  fbnst5dm virtuals law ana fi child parent relationship we wa2ef 3nd el parent and i want to know el child info 
userSchema.virtual("Messages",{
    ref:"Message",
    localField:"_id", // this is the field in the user model that references the message model ya3ni we wana wa2ef mkany ana rabet nfsy beih aw marboot b eih m3 el taraf el tany
    foreignField:"receiverId" // this is the field in the message model that references the user model
})




    // create the model from the schema
const User = mongoose.model('User', userSchema); // User is the name of the collection in the database
// that will be used in the APIS

export default User; // export the model so we can use it in the controllers and services
// we can use this model to create, read, update and delete users in the database