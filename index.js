const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const SteamTotp = require('steam-totp');
const keep_alive = require('./keep_alive.js');
const SteamBotAccountManager = require('./managers/SteamBotAccountManager.js');
const SteamAccountCredentials = require('./utils/SteamAccountCredentials.js');
const SteamTradeOffer = require('./response_models/SteamTradeOffer.js');
const TradeOfferManager = require('steam-tradeoffer-manager');
const config = require('./config.js');

const mainClient = new SteamUser();
const botClient = new SteamUser();

const account1Credentials = new SteamAccountCredentials(
   config.account1.identity_secret, 
   config.account1.shared_secret, 
   config.account1.username, 
   config.account1.password,
   config.account1.tradelink
);

const account2Credentials = new SteamAccountCredentials(
   config.account2.identity_secret, 
   config.account2.shared_secret, 
   config.account2.username, 
   config.account2.password,
   config.account2.tradelink
);


var mainCommunity = new SteamCommunity();
var botCommunity = new SteamCommunity();

const MAX_RETRIES = config.maxRetries;

var mainManager = new TradeOfferManager({
   "steam": mainClient,
   "domain": "example.com",
   "language": "en"
});

var botManager = new TradeOfferManager({
   "steam": botClient,
   "domain": "example.com",
   "language": "en"
});

const SECURITY_CODE = Math.floor((Math.random() * 99999) + 1);

var account1 = new SteamBotAccountManager(mainClient, mainCommunity, mainManager, account1Credentials);
var account2 = new SteamBotAccountManager(botClient, botCommunity, botManager, account2Credentials);

function validateCredentials(credentials, accountName) {
   if (!credentials.getUsername() || !credentials.getPassword() || 
       !credentials.getSharedSecret() || !credentials.getIdentitySecret()) {
      throw new Error(`Incomplete credentials for ${accountName}. Check your .env file`);
   }
}

try {
   validateCredentials(account1Credentials, 'account1');
   validateCredentials(account2Credentials, 'account2');
   
   console.log('Logging in account 1...');
   account1.getClient().logOn({
      "accountName": account1Credentials.getUsername(),
      "password": account1Credentials.getPassword(),
      "twoFactorCode": SteamTotp.generateAuthCode(account1Credentials.getSharedSecret())
   });

   console.log('Logging in account 2...');
   account2.getClient().logOn({
      "accountName": account2Credentials.getUsername(),
      "password": account2Credentials.getPassword(),
      "twoFactorCode": SteamTotp.generateAuthCode(account2Credentials.getSharedSecret())
   }); 
} catch (error) {
   console.error('Error during login process:', error.message);
   console.log('Check if:');
   console.log('1. Your credentials are correct in the .env file');
   console.log('2. The shared_secret and identity_secret are valid');
   console.log('3. Accounts are not blocked by Steam Guard');
   process.exit(1);
}


account1.getClient().on('loggedOn', () => {
   account1.printMessage('Successfully logged in!');
});

account1.getClient().on('error', (error) => {
   account1.printMessage('Connection error: ' + error.message);
   console.error('Error details:', error);
});

account1.getClient().on('disconnected', (eresult, msg) => {
   account1.printMessage('Disconnected: ' + msg);
});

account2.getClient().on('loggedOn', () => {
   account2.printMessage('Successfully logged in!');
});

account2.getClient().on('error', (error) => {
   account2.printMessage('Connection error: ' + error.message);
   console.error('Error details:', error);
});

account2.getClient().on('disconnected', (eresult, msg) => {
   account2.printMessage('Disconnected: ' + msg);
});

account2.getClient().on('webSession', async function(sessionID, cookies) {
   try {
      account2.printMessage('Starting web session...');
      account2.getTradeOfferBot().setCookies(cookies);
      await account2.getSteamCommunity().setCookies(cookies);
      account2.printMessage('Web session established successfully!');
   } catch (error) {
      account2.printMessage('Error establishing web session: ' + error.message);
   }
});

account1.getClient().on('webSession', async function(sessionID, cookies) {
   try {
      account1.printMessage('Starting web session...');
      account1.getTradeOfferBot().setCookies(cookies);
      await account1.getSteamCommunity().setCookies(cookies);
      account1.printMessage('Web session established successfully!');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      account1.printMessage('Searching for items in inventory...');
      var targetItem = await account1.getFirstItemInInventory();
      
      account1.printMessage("Trading item: " + targetItem.getName());

      account1.printMessage('Sending first trade offer...');
      await account1.sendTradeOffer(account2Credentials.getTradelink(), SECURITY_CODE.toString(), [targetItem], MAX_RETRIES);
   } catch (error) {
      account1.printMessage('Error during initial setup: ' + error.message);
      console.error('Error details:', error);
   }
});

account1.getTradeOfferBot().on('newOffer', async (offerResponse) => {
   try {
      account1.printMessage('NEW TRADE OFFER RECEIVED');
      var offer = new SteamTradeOffer(offerResponse, SECURITY_CODE);
      
      if (offer.isSafeTrade()) {
         account1.printMessage('Confirmed safe trade, accepting offer...'); 
         await account1.acceptIncomingSafeTradeOffer(offerResponse, MAX_RETRIES);
         
         await new Promise(resolve => setTimeout(resolve, 3000));
         
         account1.printMessage('Searching for new item in inventory...');
         var newItem = await account1.getFirstItemInInventory();

         account1.printMessage('Sending new offer with: ' + newItem.getName());
         await account1.sendTradeOffer(account2Credentials.getTradelink(), SECURITY_CODE.toString(), [newItem], MAX_RETRIES);

      } else {
         account1.printMessage('Unsafe trade detected - declining');
         offerResponse.decline().then(() => {
            account1.printMessage('Offer declined successfully');
         }).catch(err => {
            account1.printMessage('Error declining offer: ' + err.message);
         });
      }
   } catch (error) {
      account1.printMessage('Error processing new offer: ' + error.message);
      console.error('Error details:', error);
   }
});

account2.getTradeOfferBot().on('newOffer', async (offerResponse) => {
   try {
      account2.printMessage('NEW TRADE OFFER RECEIVED');
      var offer = new SteamTradeOffer(offerResponse, SECURITY_CODE);
      
      if (offer.isSafeTrade()) {
         account2.printMessage('Confirmed safe trade, accepting offer...'); 
         await account2.acceptIncomingSafeTradeOffer(offerResponse, MAX_RETRIES);

         await new Promise(resolve => setTimeout(resolve, 3000));
         
         account2.printMessage('Searching for new item in inventory...');
         var newItem = await account2.getFirstItemInInventory();

         account2.printMessage('Sending new offer with: ' + newItem.getName());
         await account2.sendTradeOffer(account1Credentials.getTradelink(), SECURITY_CODE.toString(), [newItem], MAX_RETRIES);
      } else {
         account2.printMessage('Unsafe trade detected - declining');
         offerResponse.decline().then(() => {
            account2.printMessage('Offer declined successfully');
         }).catch(err => {
            account2.printMessage('Error declining offer: ' + err.message);
         });
      }
   } catch (error) {
      account2.printMessage('Error processing new offer: ' + error.message);
      console.error('Error details:', error);
   }
});
