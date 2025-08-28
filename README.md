# Steam Trade Farm Bot

**Automated Steam trading bot that exchanges items between two accounts to increase trade count statistics.**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Steam API](https://img.shields.io/badge/Steam-API-blue)](https://steamcommunity.com/dev)

## ⚡ Features

- **Automated Trading**: Continuous item exchange between two Steam accounts
- **High Performance**: 500+ trades per hour (depending on game and network conditions)
- **Security First**: Built-in safety checks and validation for all trades
- **Environment Configuration**: Secure credential management with .env files
- **Error Recovery**: Intelligent retry system with exponential backoff
- **Real-time Monitoring**: Detailed logging and status reporting
- **Keep-Alive Server**: HTTP endpoint for deployment on cloud platforms

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** installed on your system
- **Two Steam accounts** with Mobile Authenticator enabled
- **Tradeable items** in both accounts for the selected game
- **Steam Desktop Authenticator (SDA)** for obtaining authentication secrets

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd steam-trade-farm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   ```

4. **Edit `.env` file with your credentials** (see Configuration section)

5. **Test configuration**
   ```bash
   npm run check
   ```

6. **Start the bot**
   ```bash
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Enter `env.example` and fill in your credentials:

```bash
# Account 1 Configuration
ACCOUNT1_USERNAME=your_steam_username_1
ACCOUNT1_PASSWORD=your_steam_password_1
ACCOUNT1_SHARED_SECRET=your_shared_secret_1=
ACCOUNT1_IDENTITY_SECRET=your_identity_secret_1=
ACCOUNT1_TRADELINK=https://steamcommunity.com/tradeoffer/new/?partner=XXXXX&token=XXXXX

# Account 2 Configuration  
ACCOUNT2_USERNAME=your_steam_username_2
ACCOUNT2_PASSWORD=your_steam_password_2
ACCOUNT2_SHARED_SECRET=your_shared_secret_2=
ACCOUNT2_IDENTITY_SECRET=your_identity_secret_2=
ACCOUNT2_TRADELINK=https://steamcommunity.com/tradeoffer/new/?partner=XXXXX&token=XXXXX

# Bot Settings
GAME_CODE=440
MAX_RETRIES=5
PORT=8080
```

### Obtaining Steam Credentials

#### 1. Shared Secret & Identity Secret
- Download [Steam Desktop Authenticator (SDA)](https://github.com/Jessecar96/SteamDesktopAuthenticator)
- Login with your Steam account
- Extract `shared_secret` and `identity_secret` from the SDA configuration files

#### 2. Trade Links
- Go to Steam → Inventory → Trade Offers → "Who can send me trade offers?"
- Copy the complete trade URL

#### 3. Game Codes (AppID)
| Game | AppID | 
|------|-------|
| Team Fortress 2 | 440 | 
| Unturned | 304930 | 
| Rust | 252490 | 
| DOTA 2 | 570 | 

## 📊 How It Works

1. **Authentication**: Both accounts login using Mobile Authenticator codes
2. **Web Session**: Establishes trading sessions with Steam servers  
3. **Inventory Scan**: Locates tradeable items in configured game
4. **Trade Initiation**: Account 1 sends item to Account 2 with security code
5. **Trade Acceptance**: Account 2 validates security and accepts trade
6. **Continuous Loop**: Process repeats with items switching between accounts

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the trading bot |
| `npm run check` | Validate configuration |
| `npm run setup` | Create .env from template |
| `npm test` | Run the bot (alias for start) |

## 🔒 Security Features

- **Environment Variables**: Credentials never stored in code
- **Trade Validation**: Security codes prevent unauthorized trades
- **Mobile Confirmation**: Automatic mobile authenticator acceptance
- **Error Handling**: Comprehensive error catching and recovery
- **Rate Limiting**: Built-in delays prevent Steam API abuse

## 🌐 Deployment

### Local Development
```bash
npm start
```

### Cloud Platforms
The bot includes a keep-alive server on port 8080 for platforms like:
- Heroku
- Railway
- Render
- Google Cloud Run

## 🐛 Troubleshooting

### Common Issues

**Login Errors**
- Verify username/password are correct
- Ensure Mobile Authenticator is active on both accounts
- Wait 1 minute if Steam Guard errors appear

**Empty Inventory**
- Confirm you have tradeable items in the specified game
- Verify `GAME_CODE` matches your game's AppID
- Check that items are not trade-locked

**Confirmation Errors**
- Validate `identity_secret` is correct and current
- Ensure Mobile Authenticator hasn't been reset
- Regenerate secrets using SDA if needed

**Trade Failures**
- One account may have trade restrictions
- Check Steam privacy settings (inventory must be public)
- Verify both accounts are not trade-banned

### Debug Mode
Set environment variable for detailed logging:
```bash
DEBUG=steam-trade-farm npm start
```

## ⚠️ Important Warnings

- **Use at your own risk** - Automated trading may violate Steam ToS
- **Test accounts recommended** - Don't use main/valuable accounts
- **Rate limiting** - Steam may temporarily restrict high-frequency trading
- **Account security** - Keep credentials secure and never share

## 📈 Performance Optimization

- **Minimize inventory size** for faster item lookup
- **Monitor logs** for performance bottlenecks
- **Stable internet** connection recommended

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🙏 Acknowledgments

- [steam-user](https://github.com/DoctorMcKay/node-steam-user) - Steam client library
- [steam-tradeoffer-manager](https://github.com/DoctorMcKay/node-steam-tradeoffer-manager) - Trade offer management
- [steamcommunity](https://github.com/DoctorMcKay/node-steamcommunity) - Steam Community integration
- Original concept by various Steam trading communities

---

**⚡ Built for Node.js | Updated 2025 | Use Responsibly**
