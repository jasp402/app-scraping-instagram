const { open } = require('./puppeteer.js');

document.querySelector('#btn').addEventListener('click', async () => {
  console.log('Starting...');

    let user = document.getElementById('login');
    let pass = document.getElementById('password');
    let accounts = document.getElementById('accounts');

    console.log('-->',accounts.value);
    console.log('-->',user.value);
    console.log('-->',pass.value);


  await open(user.value, pass.value, accounts.value);

  console.log('Started');
});
