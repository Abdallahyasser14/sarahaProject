// ! week 11 session 1 (sending emails)
import nodemailer from 'nodemailer';


export const sendEmail=async ({
    to,
    subject,
    //text,
    cc='abdallahshady4@gmail.com',
    html,
    attachments=[]
})=>
    {
    
    const transporter= nodemailer.createTransport({
        host:"localhost", // el server ely nodemailer hateba3t meno el email ehna delwa2ty localhost
        port:587,  // arkam mohadda 587 or 465(secure true only so use 465) or 25
        secure:false, // default false if true connection willl use TLS what is TLS? 
        // TLS is a protocol that provides a secure connection between the client and the server
        // btedy encreption in the chat email
        // law el server ely enta rafe3 3leh aslan secure f7ata law enta 3amel false hatesht8al rla law wa2ftha manual 
        service:"gmail", // law enta hateb3t men haga mo3ayan bs hayet3amel m3 hagat mot3aref 3liha bel securities beto3ha we ignore kol ely enta 3amlo fo2 nodemailer will fill all the attibutes 
        //! law 3malat service le provider mo3ayan 5alas mesh sharat tCUSTOMIZE KOL EL PARAMETERS NODEMAILER WILL FILL IT FOR YOU

        auth:{
            user: process.env.USER_EMAIL, // email of the sender
            pass:process.env.USER_PASSWORD
             // password of the sender that comes from the appmail but it is not the password of the email it is app password 
        }
    })

    const info=await transporter.sendMail({
        from:"abdallahshady4@gmail.com",
        to,
        subject,
       // text,   
       //? you cant send text and html at the same time so we will use html only because html is more flexible and it can contains text 
        cc,
        html,
        attachments
    })
    console.log("Message sent: %s", info);
    return info;
}



import { EventEmitter} from 'events';

export const eventEmitter=new EventEmitter();

// emit an event

eventEmitter.on("sendEmail",(...args)=>
    sendEmail(...args));



// we use event here why? 
// because we want to emit an event when the user is added to the database and to run it in the background so we will use event emitter 