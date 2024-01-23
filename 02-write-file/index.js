const fs = require('fs');
const { stdin, stdout } = require('process');
const os = require('os');

const output = fs.createWriteStream('./02-write-file/file.txt');

stdout.write('Write some text below: \n');
stdin.on('data', (data) => {
  const lastSymbol = os.EOL;
  const string = data.toString();
  const check = string
    .split('')
    .filter((el) => el !== lastSymbol)
    .join('');
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
