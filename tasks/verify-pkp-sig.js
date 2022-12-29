const LitJsSdk = require("lit-js-sdk/build/index.node.js");
const siwe = require("siwe");

task(
  "verify:pkp:sig",
  "Passes address1 and address2 to LitAction for a signature"
)
  .addParam("address1", "First address")
  .addParam("address2", "Second address")
  .addParam("pkp", "Public key of PKP")
  .setAction(async ({ address1, address2, pkp }, { ethers, run }) => {
    const [owner] = await ethers.getSigners();
    const domain = "localhost";
    const uri = "https://localhost/login";
    const statement = "bla";

    const siweMsg = new siwe.SiweMessage({
      domain,
      uri,
      statement,
      address: owner.address,
      version: "1",
      chainId: "1",
    });

    const preparedMsg = siweMsg.prepareMessage();
    const signature = await owner.signMessage(preparedMsg);

    const authSig = {
      sig: signature,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: preparedMsg,
      address: owner.address,
    };

    const code = `
        const go = async () => {
        const utils = ethers.utils;

        let messageHash = utils.solidityKeccak256(
            ["address", "address"],
            ["${address1}", "${address2}"],
        );

        let messageHashBinary = utils.arrayify(messageHash);

        // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
        const sigShare = await LitActions.signEcdsa({
            toSign: messageHashBinary,
            publicKey,
            sigName
        });

        }
        go();
    `;

    const litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: "serrano",
    });
    await litNodeClient.connect();
    const litResponse = await litNodeClient.executeJs({
      code,
      authSig,
      jsParams: {
        publicKey: pkp,
        sigName: "sig1",
      },
    });

    return litResponse.signatures.sig1.signature;
  });
