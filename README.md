# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

# Contracts

## TrustSigil

### Logic

- represents a trust relationship between minter and recipient of a non-transferable ERC1155 token (aka the sigil)
- specifically the token expresses that the person who minted the token to the recipient trusts the recipient, or phrased differently that the recipient is being trusted by the minter
- the context of the trust relationship is represented by the tokenId of the sigil (and the metadata that can be attached to the tokenId)
- in addition to the ERC1155 functionalities (with transfers being disabled), the contract stores for each user A, per tokenId, if user A has received a trust sigil from user B by recording the blocknumber when minting took place (variable name: `sigils`)
- before a sigil with a specific tokenId can be minted it needs to be set up first (`setupSigil`) (can be done by anyone):
  - when setting up the sigil the the user needs to specified whether a `TrustAttestor` should be used for that sigil or not
  - the TrustAttestor is a contract that could implement arbitrary logic to attest to the trust relationship between user A and user B
  - in the context of the hackathon, the TrustAttestor would be a contract that checks if there is a follower-relationship between user A and user B
  - if no TrustAttestor should be used for the tokenId, the user setting up the sigil needs to pass `0x1111111111111111111111111111111111111111` as address

### Testing locally

- install dependencies: `npm i`
- have a local node running in a separate terminal window: `npx hardhat node`
- deploy TrustSigil contract: `npx hardhat --network localhost deploy:sigil --base <baseUri>` (baseUri can be any string, it is just used to point to the metadata per tokenId)
- setup a sigil with attestor contract `npx hardhat --network localhost setup:sigil --id <tokenId> --attestor <attestorAddress>` or without attestor by omitting the param `npx hardhat --network localhost setup:sigil --id <tokenId>`
