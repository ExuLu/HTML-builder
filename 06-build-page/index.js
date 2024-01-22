const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'project-dist', 'index.html');

fs.mkdir(path.join(__dirname, 'project-dist'), (err) => {
  if (err) {
    if (err.code === 'EEXIST') return;
    console.log(err.message);
  }
});

const output = fs.createWriteStream(htmlPath);

const htmlTempStream = fs.createReadStream(
  path.join(__dirname, 'template.html'),
);
let dataFromTemplate = '';
htmlTempStream.on('data', (chunk) => (dataFromTemplate += chunk));
htmlTempStream.on('end', () => output.write(dataFromTemplate));

const compStream = fs.createReadStream(
  path.join(__dirname, 'components', 'articles.html'),
  'utf-8',
);
let dataFromComp = '';
compStream.on('data', (chunk) => (dataFromComp += chunk));
compStream.on('end', () => {
  fs.readFile(htmlPath, 'utf-8', (err, data) => {
    if (err) {
      console.log(err.message);
      return;
    }

    const replacedData = data.replace('{{articles}}', dataFromComp);
    fs.writeFile(htmlPath, replacedData, (err) => {
      if (err) {
        console.log(err.message);
        return;
      }
      const compStream = fs.createReadStream(
        path.join(__dirname, 'components', 'footer.html'),
        'utf-8',
      );
      let dataFromComp = '';
      compStream.on('data', (chunk) => (dataFromComp += chunk));

      fs.readFile(htmlPath, 'utf-8', (err, data) => {
        if (err) {
          console.log(err.message);
          return;
        }

        const replacedData = data.replace('{{footer}}', dataFromComp);
        fs.writeFile(htmlPath, replacedData, (err) => {
          if (err) {
            console.log(err.message);
            return;
          }
          const compStream = fs.createReadStream(
            path.join(__dirname, 'components', 'header.html'),
            'utf-8',
          );
          let dataFromComp = '';
          compStream.on('data', (chunk) => (dataFromComp += chunk));

          fs.readFile(htmlPath, 'utf-8', (err, data) => {
            if (err) {
              console.log(err.message);
              return;
            }

            const replacedData = data.replace('{{header}}', dataFromComp);
            fs.writeFile(htmlPath, replacedData, (err) => {
              if (err) {
                console.log(err.message);
                return;
              }
              fs.readdir(path.join(__dirname, 'components'), (err, files) => {
                if (err) {
                  console.log(err.message);
                  return;
                }
                if (!files.includes('about.html')) {
                  return;
                }

                const compStream = fs.createReadStream(
                  path.join(__dirname, 'components', 'about.html'),
                  'utf-8',
                );
                let dataFromComp = '';
                compStream.on('data', (chunk) => (dataFromComp += chunk));

                fs.readFile(htmlPath, 'utf-8', (err, data) => {
                  if (err) {
                    console.log(err.message);
                    return;
                  }

                  const replacedData = data.replace('{{about}}', dataFromComp);
                  fs.writeFile(htmlPath, replacedData, (err) => {
                    if (err) {
                      console.log(err.message);
                      return;
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

const outputCSS = fs.createWriteStream(
  path.join(__dirname, '/project-dist', 'style.css'),
);

fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  const cssFiles = files.filter((file) => {
    const { ext } = path.parse(file);
    return ext === '.css';
  });
  cssFiles.forEach((file) => {
    const input = fs.createReadStream(path.join(__dirname, 'styles', file));
    input.pipe(outputCSS);
  });
});

const sourceFolderPath = path.join(__dirname, './assets');
const destFolderPath = path.join(__dirname, 'project-dist', './assets');

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
