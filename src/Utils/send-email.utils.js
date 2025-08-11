import nodemailer from 'nodemailer';


export const sendEmail=async (to, subject, text)=>{
    
    const transporter=nodemailer.createTransport({
        host:"localhost", // el server ely nodemailer hateba3t meno el email ehna delwa2ty localhost
        port:587,  // arkam mohadda 587 or 465(secure true only so use 465) or 25
        secure:false, // default false if true connection willl use TLS what is TLS? 
        // TLS is a protocol that provides a secure connection between the client and the server
        // btedy encreption in the chat email
        // law el server ely enta rafe3 3leh aslan secure f7ata law enta 3amel false hatesht8al rla law wa2ftha manual 
        service:"gmail", // law enta hateb3t men haga mo3ayan bs hayet3amel m3 hagat mot3aref 3liha bel securities beto3ha we ignore kol ely enta 3amlo fo2 nodemailer will fill all the attibutes 
        //! law 3malat service le provider mo3ayan 5alas mesh sharat tCUSTOMIZE KOL EL PARAMETERS NODEMAILER WILL FILL IT FOR YOU

        auth:{
            user:"dodoyasser954@gmail.com", // email of the sender
            pass:"" // password of the sender that comes from the appmail
        }
    })
}
