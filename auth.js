const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const CREDENTIALS = 'env/credentials.json';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';


const getNewToken = oAuth2Client => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
    });
  });
}

const checkToken = oAuth2Client => {
  const token = fs.readFileSync(TOKEN_PATH);
  if (token) {
    return oAuth2Client.setCredentials(JSON.parse(token));
  } else {
    return getNewToken(oAuth2Client);
  }
}

const auth = () => {
  const credential = fs.readFileSync(CREDENTIALS);
    const { client_id, client_secret, redirect_uris } = JSON.parse(credential).installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    checkToken(oAuth2Client);
    return oAuth2Client;
};

module.exports = auth;