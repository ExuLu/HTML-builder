const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'bundle.css'),
);

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  const cssFiles = files.filter((file) => {
    const { ext } = path.parse(file);
    return ext === '.css';
  });
  cssFiles.forEach((file) => {
    const input = fs.createReadStream(path.join(__dirname, 'styles', file));
    input.pipe(output);
  });
});
