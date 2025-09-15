// JavaScript template
import multer from "multer";
import {fileTypes,allowedFileExtensions} from "../../Common/constants/files.constants.js";
import fs from "fs";

function createFolderIfNotExists(folderPath){
    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath,{recursive:true});
    }
}


// upload local   ya3ni hanerfa3 3l server men msehato
export const localUpload= (
    folderPath='samples',
    limits={}
)=> 
{
    


const storage = multer.diskStorage({

    destination: (req, file, cb) => 
        {

            createFolderIfNotExists(`uploads/${folderPath}`);
            cb(null, `uploads/${folderPath}`)
        },      
    filename: (req, file, cb) =>
        
        {
            console.log(file);
            cb(null, Date.now() +"-"+Math.round(Math.random()*1E9) + "-" + file.originalname)}
  });



  const fileFilter=(req,file,cb)=>{
    // file.mimetype = image/jpeg  => hagib men el extensions el abl / we ashof ely b3d el / gowa wla l2a
    const fileType=fileTypes[file.mimetype.split("/")[0]];
    if(!fileType){
        return cb(new Error("Invalid file type"),false);
    }
    
    const fileExtension=file.originalname.split(".")[1];
    if(!allowedFileExtensions[fileType].includes(fileExtension)){
        return cb(new Error("Invalid file extension"),false);
    }
    
    return cb(null,true);
    
  }
    return multer({storage,fileFilter,limits
    })  
}

export const uploadHost=(limits={})=>{  // make this to benifit from parsing only
    
const storage=multer.diskStorage({})
    
      const fileFilter=(req,file,cb)=>{
        // file.mimetype = image/jpeg  => hagib men el extensions el abl / we ashof ely b3d el / gowa wla l2a
        const fileType=fileTypes[file.mimetype.split("/")[0]];
        if(!fileType){
            return cb(new Error("Invalid file type"),false);
        }
        
        const fileExtension=file.originalname.split(".")[1];
        if(!allowedFileExtensions[fileType].includes(fileExtension)){
            return cb(new Error("Invalid file extension"),false);
        }
        
        return cb(null,true);
        
      }
        return multer({fileFilter   ,storage,limits})  
    }
//**
//        *   multer upload options 

//* 🔹 Multer Storage Options
//* 1. { dest: "uploads/" } (shortcut)

//* Stores files on disk.

//* Saves to the given folder.

//* Auto-generates random filenames.

//* No customization.

//* const upload = multer({ dest: "uploads/" });

//* 2. diskStorage (custom disk storage)

//* Stores files on disk.

//* Lets you customize:

//* destination → which folder (can depend on request/user).

//* filename → how the file is named.

//* const storage = multer.diskStorage({
//*   destination: (req, file, cb) => cb(null, "uploads/"),
//*   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
//* });
//* const upload = multer({ storage });

//* 3. memoryStorage

//* Stores files in RAM as a Buffer.

//* Disappears after request finishes (temporary).

//* Best for uploading to cloud services or quick processing.

//* const storage = multer.memoryStorage();
//* const upload = multer({ storage });

//* 🔹 Choosing Which to Use

//* ✅ Quick & simple local uploads → { dest: }

//* ✅ Need control over folder or filename → diskStorage

//* ✅ Temporary (process/send to cloud, don’t keep locally) → memoryStorage
// // 
// 
// 
// 
//  */
    