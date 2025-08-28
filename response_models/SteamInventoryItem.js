class SteamInventoryItem {
    constructor(response) {
        if (!response) {
            throw new Error('Invalid inventory item response');
        }
        this.steamInventoryItemResponse = response;
    }
    
    getName() {
        return this.steamInventoryItemResponse.market_hash_name || 'Unnamed item';
    }

    getAssetId() {
        return this.steamInventoryItemResponse.assetid || this.steamInventoryItemResponse.id;
    }

    getContextId() {
        return this.steamInventoryItemResponse.contextid || '2';
    }

    getAppId() {
        return this.steamInventoryItemResponse.appid;
    }

    getAmount() {
        return this.steamInventoryItemResponse.amount || 1;
    }

    getType() {
        return this.steamInventoryItemResponse.type || 'Unknown';
    }

    getRarity() {
        return this.steamInventoryItemResponse.tags?.find(tag => tag.category === 'Rarity')?.name || 'Common';
    }

    getMarketPrice() {
        return null;
    }

    getRawData() {
        return this.steamInventoryItemResponse;
    }

    getItemDetails() {
        return {
            name: this.getName(),
            assetId: this.getAssetId(),
            appId: this.getAppId(),
            type: this.getType(),
            rarity: this.getRarity(),
            amount: this.getAmount()
        };
    }

    isValid() {
        return this.getAssetId() && this.getName() && this.getAppId();
    }
}

module.exports = SteamInventoryItem;