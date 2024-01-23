const fs = require('fs');
const { stdin, stdout } = require('process');

const output = fs.createWriteStream('./02-write-file/file.txt');

stdout.write('Write some text below: \n');
stdin.on('data', (data) => {
  const string = data.toString();
  const check = string.trim();
  if (check === 'exit') {
    stdout.write('Thank you and goodbye!');
    process.exit();
  } else {
    output.write(string);
  }
});

process.on('SIGINT', () => {
  stdout.write('\nThank you and goodbye!');
  process.exit();
});
