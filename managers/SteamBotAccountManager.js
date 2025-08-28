const SteamInventoryItem = require('../response_models/SteamInventoryItem.js');
const config = require('../config.js');

const GAME_CODE = config.gameCode;

class SteamBotAccountManager {
    constructor(client, community, tradeOfferManager ,credentials) {
        this.tradeOfferBot = tradeOfferManager;
        this.client = client; // Steam User
        this.community = community;
        this.inventory = [];
        this.credentials = credentials;
    }

    async getAndFetchInventory() {
        await this.#fetchInventory();
        return this.inventory;
    }

    getTradeOfferBot() {
        return this.tradeOfferBot;
    }

    getSteamCommunity() {
        return this.community;
    }

    getClient() {
        return this.client;
    }

    async getFirstItemInInventory() {
        var inventoryItems = await this.getAndFetchInventory();

        if (inventoryItems.length == 0) {
            throw new Error("Inventory for " + GAME_CODE + " appId is empty.");
        }
     
        return inventoryItems[0];
    }

    async sendTradeOffer(tradelink, message, steamInventoryItemList, maxRetries) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!tradelink || !message || !steamInventoryItemList || steamInventoryItemList.length === 0) {
                    throw new Error('Invalid parameters for sendTradeOffer');
                }

                this.printMessage(`Creating trade offer (retries left: ${maxRetries})...`);
                let offer = this.tradeOfferBot.createOffer(tradelink);
                offer.setMessage(message);

                steamInventoryItemList.forEach(item => {
                    try {
                        offer.addMyItem(item.getRawData());
                    } catch (itemErr) {
                        this.printMessage('Error adding item to offer: ' + itemErr.message);
                        throw itemErr;
                    }
                });

                offer.send(async (err, status) => {
                    if (err) {
                        this.printMessage('Error sending offer: ' + err.message);
                        
                        if (maxRetries <= 0) {
                            this.printMessage('Maximum retries reached for sendTradeOffer');
                            return reject(err);
                        }
                        
                        setTimeout(() => {
                            this.sendTradeOffer(tradelink, message, steamInventoryItemList, maxRetries - 1)
                                .then(resolve)
                                .catch(reject);
                        }, 2000);
                    } else if (status === 'pending') {
                        this.printMessage('Offer sent, waiting for confirmation...');
                        try {
                            await this.#acceptConfirmation(offer);
                            this.printMessage('Offer confirmed successfully!');
                            return resolve(1);
                        } catch (confirmErr) {
                            this.printMessage('Confirmation error: ' + confirmErr.message);
                            return reject(confirmErr);
                        }
                    } else {
                        this.printMessage('Offer sent with status: ' + status);
                        return resolve(1);
                    }
                });
            } catch (error) {
                this.printMessage('General error in sendTradeOffer: ' + error.message);
                return reject(error);
            }
        });
    }

    async acceptIncomingSafeTradeOffer(offer, maxRetries) {
        return new Promise((resolve, reject) => {
            try {
                if (!offer) {
                    throw new Error('Invalid trade offer');
                }

                this.printMessage(`Accepting trade offer (retries left: ${maxRetries})...`);
                
                offer.accept((acceptanceErr) => {
                    if (acceptanceErr) {
                        this.printMessage('Error accepting offer: ' + acceptanceErr.message);
                        
                        if (maxRetries <= 0) {
                            this.printMessage('Maximum retries reached for acceptIncomingSafeTradeOffer');
                            return reject(acceptanceErr);
                        }
                        
                        setTimeout(() => {
                            this.acceptIncomingSafeTradeOffer(offer, maxRetries - 1)
                                .then(resolve)
                                .catch(reject);
                        }, 2000);
                    } else {
                        this.printMessage('Offer accepted successfully!');
                        return resolve(1);
                    }
                });
            } catch (error) {
                this.printMessage('General error in acceptIncomingSafeTradeOffer: ' + error.message);
                return reject(error);
            }
        });   
    }

    printMessage(message) {
        console.log("[" + this.credentials.getUsername() + "] " + message);
    }


    async #fetchInventory() {
        try {
            this.printMessage('Fetching inventory...');
            
            this.inventory = await new Promise((resolve, reject) => {
                this.tradeOfferBot.getInventoryContents(GAME_CODE, 2, true, (err, inventory) => {
                    if (err) {
                        this.printMessage('Error fetching inventory: ' + err.message);
                        return reject(err);
                    }
                    
                    if (!inventory || inventory.length === 0) {
                        this.printMessage('Empty inventory for game ' + GAME_CODE);
                        return resolve([]);
                    }
                    
                    this.printMessage(`Found ${inventory.length} items in inventory`);
                    return resolve(inventory.map(item => new SteamInventoryItem(item)));
                });
            });
        } catch (error) {
            this.printMessage('General error fetching inventory: ' + error.message);
            throw error;
        }
    }

    async #acceptConfirmation(offer) {
        return await new Promise((resolve, reject) => {
            try {
                if (!offer || !offer.id) {
                    throw new Error('Invalid offer for confirmation');
                }
                
                this.printMessage('Accepting mobile confirmation...');
                
                this.community.acceptConfirmationForObject(this.credentials.getIdentitySecret(), offer.id, (err) => {
                    if (err) {
                        this.printMessage('Mobile confirmation error: ' + err.message);
                        return reject(err);
                    } else {
                        this.printMessage('Mobile confirmation accepted successfully!');
                        return resolve(1);
                    }
                });
            } catch (error) {
                this.printMessage('General confirmation error: ' + error.message);
                return reject(error);
            }
        });
    }
}

module.exports = SteamBotAccountManager;
