const path = require('path');
const fs = require('fs');

fs.readdir('./03-files-in-folder/secret-folder', (err, files) => {
  if (err) console.log(err.message);
  else {
    files.forEach((file) => {
      fs.stat(
        path.join(__dirname, '/secret-folder', file),
        (err, statistics) => {
          if (err) console.log(err.message);
          else {
            if (statistics.isFile()) {
              const info = path.parse(file);
              let output = `${info.name} - ${info.ext.slice(1)} - ${
                statistics.size / 1000
              }kb`;
              console.log(output);
            }
          }
        },
      );
    });
  }
});
