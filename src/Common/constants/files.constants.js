




export const fileTypes={
    Image:"image",
    Video:"video",
    Audio:"audio",
    Document:"document",
    Application:"application"
}


export const allowedFileExtensions={
    [fileTypes.Image]:[".jpg",".jpeg",".png",".gif",".webp"],
    [fileTypes.Video]:[".mp4",".avi",".mkv",".mov",".wmv"],
    [fileTypes.Audio]:[".mp3",".wav",".aac",".flac",".ogg"],
    [fileTypes.Document]:[".pdf",".doc",".docx",".xls",".xlsx"],
    [fileTypes.Application]:[".exe",".msi",".dmg",".app",".apk"]
}