const LitJsSdk = require("lit-js-sdk/build/index.node.js");
const siwe = require("siwe");

const publicKey =
  "0x04f4aae20fc84fcc515f1c1cb17cadfe75845c1ea9e478fdd5b3c7be4f7098e62957c4cdee9df6d43d094951dcdde468684e1b847758826bc17a2a2d0b56108e17";

const getLitParams = async (ethers) => {
  const [signer, other] = await ethers.getSigners();
  // let message = utils.arrayify(messageHash)

  const code = `
    const go = async () => {
    const utils = ethers.utils;

    let message = utils.solidityKeccak256(
        ["address", "address"],
        ["${signer.address}", "${other.address}"],
    );

    // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
    const sigShare = await LitActions.ethPersonalSignMessageEcdsa({
        message,
        publicKey,
        sigName
    });

    }
    go();
    `;

  const domain = "localhost";
  const uri = "https://localhost/login";
  const statement = "bla";

  const siweMsg = new siwe.SiweMessage({
    domain,
    uri,
    statement,
    address: signer.address,
    version: "1",
    chainId: "1",
  });

  const preparedMsg = siweMsg.prepareMessage();
  const signature = await signer.signMessage(preparedMsg);

  const authSig = {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: preparedMsg,
    address: signer.address,
  };

  return { authSig, code };
};

task("verify:pkp:sig", "TODO").setAction(async (_, { ethers, run }) => {
  const [owner, other] = await ethers.getSigners();
  let messageHash = ethers.utils.solidityKeccak256(
    ["address", "address"],
    [owner.address, other.address]
  );

  // STEP 2: 32 bytes of data in Uint8Array
  //   let messageHashBinary = ethers.utils.arrayify(messageHash);

  //   // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
  //   let signature = await owner.signMessage(messageHashBinary);

  const { authSig, code } = await getLitParams(ethers);

  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "serrano",
  });
  await litNodeClient.connect();
  const litResponse = await litNodeClient.executeJs({
    code,
    authSig,
    jsParams: {
      publicKey,
      sigName: "sig1",
    },
  });
  //   console.log("msg hash: ", messageHash);
  console.log("ethers hashMessage: ", ethers.utils.hashMessage(messageHash));
  console.log(litResponse);
  console.log(
    ethers.utils.verifyMessage(
      litResponse.signatures.sig1.dataSigned,
      litResponse.signatures.sig1.signature
    )
  );
  console.log(
    ethers.utils.recoverPublicKey(
      litResponse.signatures.sig1.dataSigned,
      litResponse.signatures.sig1.signature
    )
  );
  console.log(
    ethers.utils.recoverAddress(
      litResponse.signatures.sig1.dataSigned,
      litResponse.signatures.sig1.signature
    )
  );
});
