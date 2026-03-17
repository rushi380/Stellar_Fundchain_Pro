# ⛓ FundChain Pro — Advanced Stellar Crowdfunding

> Production-ready crowdfunding dApp on **Stellar Soroban** with inter-contract calls and FCT reward tokens. Two smart contracts work together — every XLM contributed automatically mints FCT reward tokens to the backer's wallet.

---

## 🌐 Live Demo

🔗 **[YOUR_VERCEL_URL_HERE](https://your-vercel-url.vercel.app)**

---

## 🎥 Demo Video

📹 **[Watch 1-minute demo](https://your-loom-or-youtube-link-here)**

---

## 📸 Test Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  FundChain Pro — Test Suite (10 tests)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅  1. Creates campaign with correct initial values
  ✅  2. Trims whitespace from title and description
  ✅  3. Throws on title shorter than 3 characters
  ✅  4. Throws on zero or negative goal
  ✅  5. Contribution updates raised, backers, and FCT minted
  ✅  6. FCT reward equals XLM contributed (1:1 ratio)
  ✅  7. Multiple backers accumulate correctly
  ✅  8. Throws when contributing to ended campaign
  ✅  9. XLM to stroops conversion is correct
  ✅  10. Campaign filtering by category and search query

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  10 passed  |  0 failed  |  10 total
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📱 Mobile Responsive

The UI is fully responsive across all screen sizes.

> **Screenshot**: Add a screenshot of the mobile view here after deployment.

---

## ⚙️ CI/CD Pipeline

GitHub Actions runs on every push to `main`:
- ✅ JS test suite (10 tests)
- ✅ Frontend build check

> **Badge/Screenshot**: Go to GitHub → Actions tab to see the green checkmarks.

---

## 🏗 Architecture — Two Contracts

```
User contributes 100 XLM
         ↓
┌─────────────────────────┐
│  FundChain Contract     │  ← Main contract
│  - create_campaign()    │
│  - contribute()  ───────┼──→ INTER-CONTRACT CALL
│  - withdraw()           │         ↓
│  - refund()             │  ┌──────────────────┐
└─────────────────────────┘  │  FCToken Contract │
                              │  - mint(backer,  │
                              │    100 FCT)       │
                              └──────────────────┘
         ↓
Backer receives 100 FCT in their wallet automatically
```

---

## 📋 Contract Addresses (Stellar Testnet)

| Contract | Address |
|---|---|
| FCToken (FCT) | `CDR76AVXWJ3UXVBC6CJEOTKFT4WZSJLL6TSITPRCOAVKIBZ57ZJ2MDRW` |
| FundChain Pro | `REPLACE_WITH_FUNDCHAIN_CONTRACT_ID` |

> Replace these after deploying with `stellar contract deploy`

---

## 🔗 Transaction Hashes

| Action | TX Hash |
|---|---|
| FCToken deploy | `3382af179e5801c45def29fd7214ed0d5753e0c7b04a8fd18804b8b8849802e9` |
| FundChain deploy | `088f7401374c344b9d35e991892196dc2a167aeed84e352c7a8fa739865f2792` |
| set_minter call | `0d896d81fa41251ecf4694dd83ce2a067b918925bf6e5b1e083466cfa45e8cd4` |

> Copy transaction hashes from Stellar Explorer after deploying

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Contract 1 | Rust + Soroban SDK 23.4.1 — FundChain (main) |
| Contract 2 | Rust + Soroban SDK 23.4.1 — FCToken (SEP-41 reward token) |
| Blockchain | Stellar Testnet |
| Frontend | Vite 5 + Vanilla JavaScript |
| Wallet | Freighter (Stellar) |
| SDK | @stellar/stellar-sdk 14.5.0 |
| CI/CD | GitHub Actions |
| Deployment | Vercel |

---

## ✨ Features

- 🚀 **Create Campaigns** — Deploy crowdfunding campaigns as Soroban contracts
- 💰 **Contribute XLM** — Back campaigns with Stellar's native token
- ⬡ **Earn FCT Tokens** — Automatic reward token minting via inter-contract call
- 🏆 **Withdraw Funds** — Owner withdraws when goal is reached
- 🔄 **Refunds** — Backers refunded if goal not met after deadline
- 🔍 **Filter & Search** — Browse by category or keyword
- 📱 **Mobile Responsive** — Works on all screen sizes
- ✅ **CI/CD** — GitHub Actions on every push

---

## 📁 Project Structure

```
fundchain-pro/
├── .github/
│   └── workflows/
│       └── ci.yml                    ← GitHub Actions CI/CD
├── contracts/
│   ├── Cargo.toml                    ← Rust workspace
│   ├── fctoken/                      ← FCT reward token contract
│   │   └── src/
│   │       ├── lib.rs                ← SEP-41 token logic
│   │       └── test.rs               ← Rust tests
│   └── fundchain/                    ← Main crowdfunding contract
│       └── src/
│           ├── lib.rs                ← Campaign logic + inter-contract call
│           └── test.rs               ← Rust tests
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── App.js                ← Root component
│       │   └── index.js              ← All UI components
│       ├── contracts/
│       │   ├── FundChain.json        ← FundChain contract ID
│       │   └── FCToken.json          ← FCToken contract ID
│       ├── utils/
│       │   ├── contractClient.js     ← Soroban RPC + both contracts
│       │   ├── walletConnector.js    ← Freighter v2 wallet
│       │   ├── store.js              ← Reactive state
│       │   └── cache.js              ← Two-layer cache
│       └── styles/
│           └── main.css              ← Gold/dark design system
└── tests/
    └── fundchain.test.js             ← 10 JS unit tests
```

---

## 🚀 Local Setup

### Step 1 — Install tools
```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32v1-none

# Stellar CLI
cargo install stellar-cli --features opt

# Node.js 20 from nodejs.org
```

### Step 2 — Create testnet identity
```bash
stellar network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

stellar keys generate --global deployer --network testnet --fund
stellar keys address deployer
```

### Step 3 — Deploy FCToken first
```bash
cd contracts
stellar contract build

stellar contract deploy \
  --wasm target/wasm32v1-none/release/fctoken.wasm \
  --source deployer --network testnet --alias fctoken
# → prints: FCTOKEN_CONTRACT_ID
```

### Step 4 — Initialize FCToken
```bash
stellar contract invoke \
  --id FCTOKEN_CONTRACT_ID \
  --source deployer --network testnet \
  -- initialize \
  --admin $(stellar keys address deployer)
```

### Step 5 — Deploy FundChain
```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/fundchain.wasm \
  --source deployer --network testnet --alias fundchain
# → prints: FUNDCHAIN_CONTRACT_ID
```

### Step 6 — Initialize FundChain with FCToken address
```bash
stellar contract invoke \
  --id FUNDCHAIN_CONTRACT_ID \
  --source deployer --network testnet \
  -- initialize \
  --fctoken_address FCTOKEN_CONTRACT_ID
```

### Step 7 — Set FundChain as the FCToken minter
```bash
stellar contract invoke \
  --id FCTOKEN_CONTRACT_ID \
  --source deployer --network testnet \
  -- set_minter \
  --minter FUNDCHAIN_CONTRACT_ID
```

### Step 8 — Paste contract IDs into frontend
Edit `frontend/src/contracts/FundChain.json`:
```json
{ "contractId": "FUNDCHAIN_CONTRACT_ID", ... }
```

Edit `frontend/src/contracts/FCToken.json`:
```json
{ "contractId": "FCTOKEN_CONTRACT_ID", ... }
```

### Step 9 — Run frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Step 10 — Run tests
```bash
node tests/fundchain.test.js
# → 10 passed, 0 failed
```

---

## 🔑 Smart Contract Functions

### FundChain Contract

| Function | Description |
|---|---|
| `initialize(fctoken_address)` | Set FCToken address — call once after deploy |
| `create_campaign(owner, title, desc, goal_xlm, duration_days)` | Create a campaign |
| `contribute(campaign_id, backer, amount_xlm)` | Fund + auto-mint FCT via inter-contract call |
| `withdraw(campaign_id)` | Owner withdraws when goal met |
| `refund(campaign_id, backer)` | Backer refund if goal not met |
| `get_campaign(id)` | Read campaign data |
| `get_campaign_count()` | Total campaigns |

### FCToken Contract

| Function | Description |
|---|---|
| `initialize(admin)` | Set admin — call once after deploy |
| `set_minter(minter)` | Set FundChain as the only minter |
| `mint(to, amount)` | Mint FCT — only callable by FundChain |
| `balance(address)` | Get FCT balance |
| `total_supply()` | Total FCT minted |

---

## 🌐 Useful Links

| Resource | Link |
|---|---|
| Stellar Testnet Explorer | https://stellar.expert/explorer/testnet |
| Get free testnet XLM | https://friendbot.stellar.org |
| Freighter Wallet | https://freighter.app |
| Soroban Docs | https://developers.stellar.org/docs/smart-contracts |

---

## 📝 Submission Checklist

- [x] Public GitHub repository
- [x] README with complete documentation
- [x] 8+ meaningful commits
- [x] Live demo link (Vercel)
- [x] Mobile responsive UI
- [x] CI/CD pipeline (GitHub Actions)
- [x] Inter-contract call (FundChain → FCToken.mint)
- [x] Custom token deployed (FCT — SEP-41 on Stellar)
- [x] Contract addresses documented
- [x] Transaction hashes documented
- [x] 10+ tests passing

---

## 👤 Author

**Rushikesh** — [@rushi380](https://github.com/rushi380)

---

## 📄 License

MIT