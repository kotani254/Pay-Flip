
# Payflip

PayFlip is a platform that seamlessly converts local currency payments into stablecoin settlements, bridging the gap between traditional and digital finance.

# What it does:
- Enables users to make payments in their local currency (e.g., via M-Pesa)
- Automatically converts payments to stablecoins for merchant settlements
- Integrates KotaniAPI for stablecoin settlements and  fiat collections
- Simplifies the on/off-ramp process for cryptocurrency transactions


## Inspiration  💡

The inspiration for PayFlip comes from recognizing the growing potential of cryptocurrency and blockchain technology, while also acknowledging the barriers that prevent widespread adoption. The vision is to create a bridge between traditional financial systems and the emerging world of digital assets, making crypto more accessible and practical for everyday use.

### Problem Statement
The  problem PayFlip aims to solve is the complexity and inefficiency in the current landscape of cross-border payments and crypto adoption. Specifically:

- Crypto Adoption Barrier: The process of acquiring and using cryptocurrencies remains complex for many everyday users, hindering widespread adoption.
- On/Off-Ramp Complexity: Existing on-ramp and off-ramp processes for cryptocurrency transactions are often complicated and time-consuming, discouraging potential users.
- Currency Volatility: Merchants in regions with volatile local currencies face financial risks when accepting payments.
- Integration Challenges: There's a lack of seamless integration between traditional payment systems and blockchain-based financial solutions.


### How It Works
PayFlip operates as a bridge between local currency payments and stablecoin settlements. Here's a step-by-step breakdown of the process:

- User Payment:

A user makes a payment in their local currency (e.g., Kenyan Shillings via M-Pesa).
The payment is processed through KotaniPay Collections  API.


- Currency Conversion:

Payment is confirmed and the get an onramp rate from KOtaniAPI's and calculate the stablecoin amount to be settled.


- Stablecoin Settlement:

The system interacts with KotaniPay's API to facilitate the stablecoin transaction.
The equivalent amount of stablecoin is transferred to the merchant's wallet.


- Confirmation:

Both the user and the merchant receive confirmations of the completed transaction.
The merchant can now access the stablecoin in their wallet.



### Tech Stack

Frontend:

Next.js: React framework for building the user interface
Tailwind CSS: For styling and responsive design
Wagmi: For Ethereum (Base) interactions in the frontend


#### Backend:

Next.js API Routes: For server-side logic and API endpoints


#### API and Integrations:

Kotani API: For handling local currency collections, on-ramp processes, and stablecoin settlements


#### Blockchain Technologies:

Base: The underlying blockchain infrastructure
Solidity: For writing smart contracts
onchainkit: For smart wallet management and blockchain interactions
Base Names: For human-readable wallet addresses

###  🚧 Challenges 🚧
Integrating BaseNames and smart wallet was a challenge. Also handling all the transactions of a deposit and settlement seamlessly proved to be a hard nut to crack.
With the use of Onchainkit I was able to integrate Smart wallet with ease and using of asynchronous calls i handled payment and status checking on the transaction seamlessly


### What Next For Vetra Cloud
- Enabling more stablecoins for payouts. (Currently accepting USDC $ USDT)
- Accepting more local currencies for Collections (Currently accepting KES $ GHS)
