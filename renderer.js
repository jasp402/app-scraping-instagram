const { open } = require('./puppeteer.js');
const ipcRenderer = require('electron').ipcRenderer;

let dir = undefined;

//AddEvent select Folder // get path with api electron
document.getElementById('dirs').addEventListener('click', () => {
  ipcRenderer.send('selectDirectory');
});

//get path as result with api electron
ipcRenderer.on('variable-reply', function (event, args) {
  dir = args ? args[0] : dir;
    let path  = document.getElementById('path');
    path.innerText = '.../'+dir.split('\\').pop();
});

document.querySelector('#btn').addEventListener('click', async () => {
  console.log('Starting...');

    let user = document.getElementById('login');
    let pass = document.getElementById('password');
    let accounts = document.getElementById('accounts');

    console.log('-->',accounts.value);
    console.log('-->',user.value);
    console.log('-->',pass.value);
    console.log('-->',dir);

  await open(user.value, pass.value, accounts.value, dir);

  console.log('Started');
});
