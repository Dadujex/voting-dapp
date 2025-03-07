async function main() {
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.deployed();
    console.log("Voting deployed to:", voting.address);
  
    await voting.createTopic("Kedvenc szín", ["Piros", "Kék", "Zöld"]);
    console.log("First topic created");
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });