[![Netlify Status](https://api.netlify.com/api/v1/badges/02f76f40-aaeb-4ad2-85a9-2c25ecb7f2cb/deploy-status)](https://app.netlify.com/sites/alchemist-wtf/deploys)

Frontend for alchemistcoin

LICENSE: MIT

# Buttons (language on left, technical description on right)

## Stake
- Withdraw <> Transfer unlocked LP tokens from Crucible to msg.sender
  \*\* Max amount = crucible balance - locked balance
- Increase stake <> Deposit more LP tokens to crucible lock
  \*\* Max = undelegated LP token balance
- Unstake and claim <> Claim/transfer existing rewards (proportional to LP token amount) from Aludel to recipient and unlock LP tokens from crucible
  \*\* Max = locked LP balance

## Mint
- Mint and Stake <> Mint Crucible, Lock LP tokens, and Stake
- Lock <> Take unlocked LP tokens already on the crucible and lock them

## Running on a test network
- You can run the project locally on Rinkeby with `yarn run start:rinkeby`
- To get MIST and LP token, go to [app.uniswap.org](https://app.uniswap.org), switch to Rinkeby Network, and add token 0xF6c1210Aca158bBD453A12604A03AeD2659ac0ef. Then [add liquidity](https://app.uniswap.org/#/add/ETH/0xF6c1210Aca158bBD453A12604A03AeD2659ac0ef)
