import crypto from 'crypto';
import { buffer, text } from 'stream/consumers';
import fs from 'fs';
const IV_LENGTH=+process.env.IV_LENGTH
// IV is a random value that is used to make the encryption more secure it won't affect the decryption process because we will use the same iv to decrypt the data
// IV is not encrypted it is just used to make the encryption more secure 

const ENCRYPTION_SECRET_KEY=Buffer.from(process.env.ENCRYPTION_SECRET_KEY); 
// this is a secret key that will be used to encrypt and decrypt the data , bufferfrom returns binary and it is a must format for the crypto function
// IN SYMMETRIC ENCRYPTION WE USE THE SAME KEY TO ENCRYPT AND DECRYPT THE DATA

export const encryptData = (data) => {
    //1 
    const iv= crypto.randomBytes(IV_LENGTH);
    //2
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY,iv); // create a cipher using the aes-256-cbc algorithm

// iv is the initialization vector that is used to make the encryption more secure because without it the same data will always produce the same encrypted output so it could be easily decrypted
// so the iv is a random value that is used to make the encryption more secure it won't affect the decryption process because we will use the same iv to decrypt the data
// we dont encrypt we just start the encryption process with it  
// it is not like that iv + encyption of the text 3shan law keda ma bardo heya heya el attavker will ignore the iv and see patterns in the encrypted data
// but in the encyption each block of ciphertext depends on the previous block, and each block affects the next. so el awl bib2a random fely ba3do haye5talef
// iv we didnt encrypte it we just encypt with it 
//? WITH 1 AND 2 WE JUST MAKE THE FIRST STEP "create cipher " TILL NOW WE DIDNT MAKE ENCYPTION TILL NOW



let encrpytedData =cipher.update(data,'utf-8','hex')
//? keda step 2 update di ely bettal3 el encryption 
// ? update returns the encrypted data as a buffer
// let not const because we will update it in final


encrpytedData+= cipher.final('hex')
//? el final bete3mel end lel encryption preocess we kaman law etb2a block heya ely bet3melo heya btemshy 16 by 16 flaw etb2a haga el final ely btetsaraf
// ? bet3mel pad 3shan teb2aa divisble by 16 el update process only completed blocks el final ely bet5alas
// ? returns last chunk ya3ni ely not completed and not processed by the update so hanzawed ely tale3 men el final 3la el updated



return `${iv.toString('hex')}:${encrpytedData}`  
// d2a mogarad return way(momken be ay tari2a) we need the iv in the decreption so we want to store it in the Database
// so we must even if we save or retreieve the enctypted store or save with it the iv 3shan we ehna bne3ml decreption
// iv can be not secured normally


}


// TO MAKE ENCRYPTION WE DIVIDE THE CYPHER INTO BLOCKS OR PARTS 
 /**
  <!--
  //! 1. create cipher => this is the first part of the encryption process.  takes the data and the secret key and returns an encrypted string and the algorithm used to encrypt the data
  //! 2. update cipher => make another encryption on the data
  //! 3. final cipher => combination of the three 
  -->
  */


export const decrypt = (encryptedString) => {
  const [ivHex, encryptedHex] = encryptedString.split(':');

  const iv = Buffer.from(ivHex.trim(), 'hex');         // Convert IV back to buffer
  const encrypted = encryptedHex.trim();

  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY,iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
};


// ===========================================================================================================================================================================================
//? assymetric encryption ?// 

//! steps
/**
 ** 1. generate 2 keys [public key for encryption and private key for decryption] b3d ma te3mlhom create lazem te3mlhom save 3shan ma tefdalsh te3ml generate

 * 
 */





// !  before i generate the keys i will check if they exist or not 
if (fs.existsSync('publicKey.pem') && fs.existsSync('privateKey.pem')) {
  console.log('Keys already exist');

}

else // so create

{
   //encryption    decryption
 const {publicKey,privateKey}=crypto.generateKeyPairSync('rsa', {
                                                      // algoirthm
  modulusLength:2048, // size of the key in bits
  publicKeyEncoding:{  
    type:'pkcs1', // type of the key this is the standard
    format:'pem' // format of the key this is the standard and most famous
  },
  privateKeyEncoding:{
    type:'pkcs1',
    format:'pem'
  }
});

// save the keys to a file to use them in the encryption and decryption and not geneate each time
fs.writeFileSync('publicKey.pem', publicKey);
fs.writeFileSync('privateKey.pem', privateKey);

// do not tuch those files again please it will corrupt the keys
}


export const assymetricEncryption = (text) => {   // beta5od el text in buffer form  ely bet3mel encryption we el publick key
  const publicKey = fs.readFileSync('publicKey.pem');
  const encrypted = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING                            
    
    //? why we use padding? 
    //? we use padding because we want to make the encryption more secure
    //? padding is a random value that is used to make the encryption more secure it won't affect the decryption process because we will use the same padding to decrypt the data
    //? padding is not encrypted it is just used to make the encryption more secure 
    //? and if we dont make the padding the same in encryption and decryption the data will be corrupted and error will be thrown
  }, 
  Buffer.from(text)); // returns encrypted data in buffer form 
  
  return encrypted.toString('hex');
  //? why base64?
  //? base64 is a way to encode the data so it can be stored in a file or sent over a network
};

export const assymetricDecryption = (encryptedText) => {  //!  the same code of encryption but with private key
   // beta5od el encrypted text in buffer form  ely bet3mel decryption we el private key
  const privateKey = fs.readFileSync('privateKey.pem');
  const decrypted = crypto.privateDecrypt
  
  ({
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING                            
    //? why we use padding? 
    //? we use padding because we want to make the encryption more secure
    //? padding is a random value that is used to make the encryption more secure it won't affect the decryption process because we will use the same padding to decrypt the data
    //? padding is not encrypted it is just used to make the encryption more secure 
    //? and if we dont make the padding the same in encryption and decryption the data will be corrupted and error will be thrown
  }, 
  Buffer.from(encryptedText, 'hex')
); // returns decrypted data in buffer form 
  
  return decrypted.toString('utf-8');
};
