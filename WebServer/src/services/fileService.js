const fs = require('fs-extra'); // Classic fs
const path = require('path');


function uploadFile(readStreamFiles, filename, mimeType, allowedType, uploadPath) {
    if (!filename || filename === '') {
        return { succeeded: false, msg : `Tried to upload no file.`};
    } else if (mimeType != allowedType) {
        return { succeeded: false, msg : `File '${filename}' is unsupported. ${mimeType} ${typeof mimeType}`};
    } else {
        
        // console.log(`Upload of '${filename}' started`);

        // Remove path dir content.
        if(fs.existsSync(uploadPath))
            deleteFolderRecursive(uploadPath);
        if(!fs.existsSync(uploadPath))
            fs.mkdirSync(uploadPath);

        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));

        // Pipe it trough
        readStreamFiles.pipe(fstream);

        // On finish of the upload
        fstream.on('close', () => {
            // console.log(`Upload of '${filename}' finished`);
        });
        return { succeeded: true, msg : ''};
    }
}

function deleteFolderRecursive(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

module.exports = uploadFile;