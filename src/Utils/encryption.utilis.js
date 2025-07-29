import crypto from 'crypto';
import { buffer, text } from 'stream/consumers';

const IV_LENGTH=16
const ENCRYPTION_SECRET_KEY=Buffer.from('12345678901234567890123456789012'); // this is a secret key that will be used to encrypt and decrypt the data , bufferfrom returns binary and it is a must for the crypto function
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
//? keda step 2 update di ely bettal3 el encypton 



encrpytedData+= cipher.final('hex')
//? el final bete3mel end lel encryption preocess we kaman law etb2a block heya ely bet3melo heya btemshy 16 by 16 flaw etb2a haga el final ely btetsaraf
// ? bet3mel pad 3shan teb2aa divisble by 16 el update process only completed blocks el final ely bet5alas
// ? returns last chunk ya3nii ely not completed and not processed by the update so hanzawed ely tale3 men el final 3la el updated



return `${iv.toString('hex')}  : ${encrpytedData}`  // d2a mogarad return way(momken be ay tari2a) we need the iv in the decreption 

// so we must even if we save or retreieve the enctypted store or save with it the iv 3shan we ehna bne3ml decreption
// iv can be not secured normally


}


// TO MAKE ENCRYPTION WE DIVIDE THE CYPHER INTO BLOCKS OR PARTS 
 /**
  ** create cipher => this is the first part of the encryption process
  ** => takes the data and the secret key and returns an encrypted string and the algorithm used to encrypt the data
  * * update cipher => make another encyption on the data
  * * final cipher => combination of the three
  * 
  */

