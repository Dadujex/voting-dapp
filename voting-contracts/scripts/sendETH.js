const { ethers } = require("hardhat");

async function main() {
  const [sender] = await ethers.getSigners();

  const receiverAddress = ""; //addr to send eth to

  const tx = {
    to: receiverAddress,
    value: ethers.utils.parseEther("1.0"), 
  };

  const txResponse = await sender.sendTransaction(tx);

  await txResponse.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});