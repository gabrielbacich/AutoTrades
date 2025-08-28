class SteamTradeOffer {
    constructor(incomingOffer, securityCode) {
        if (!incomingOffer) {
            throw new Error('Invalid trade offer');
        }
        if (!securityCode) {
            throw new Error('Invalid security code');
        }
        
        this.offer = incomingOffer;
        this.SECURITY_CODE = securityCode;
    }

    getMessage() {
        return this.offer.message || '';
    }

    getItemsToGive() {
        return this.offer.itemsToGive || [];
    }

    getItemsToReceive() {
        return this.offer.itemsToReceive || [];
    }

    getOfferId() {
        return this.offer.id;
    }

    getPartner() {
        return this.offer.partner;
    }

    isSafeTrade() {
        const message = this.getMessage();
        const itemsToGive = this.getItemsToGive();
        
        const isSecureMessage = message === this.SECURITY_CODE.toString();
        const isNotGivingItems = itemsToGive.length === 0;
        
        return isSecureMessage && isNotGivingItems;
    }

    getTradeDetails() {
        return {
            id: this.getOfferId(),
            partner: this.getPartner(),
            message: this.getMessage(),
            itemsToGive: this.getItemsToGive().length,
            itemsToReceive: this.getItemsToReceive().length,
            isSafe: this.isSafeTrade()
        };
    }

}

module.exports = SteamTradeOffer;