const fs = require('fs');
const path = require('path');

const sourceFolderPath = path.join(__dirname, './files');
const destFolderPath = path.join(__dirname, './files-copy');

function ifError(err) {
  if (err) {
    console.log(err.message);
  }
}

function copyFolder(source, dest) {
  fs.cp(source, dest, { recursive: true, force: true }, ifError);
}

function checkForDeletedFiles(source, dest) {
  fs.readdir(dest, (err, files) => {
    if (err) return;
    const destFiles = files;
    fs.readdir(source, (err, files) => {
      const sourFiles = files;
      destFiles.forEach((file) => {
        if (!sourFiles.includes(file))
          fs.unlink(path.join(dest, file), ifError);
      });
    });
  });
}

function copyDir(source, dest) {
  copyFolder(source, dest);
  checkForDeletedFiles(source, dest);
}

copyDir(sourceFolderPath, destFolderPath);
