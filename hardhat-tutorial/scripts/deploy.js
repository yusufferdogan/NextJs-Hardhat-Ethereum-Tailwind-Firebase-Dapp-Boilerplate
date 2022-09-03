const { ethers } = require("hardhat");

async function main() {
  const constructorArgs = [100];
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  // here we deploy the contract
  const deployedWhitelistContract = await whitelistContract.deploy(
    ...constructorArgs
  );
  // 10 is the Maximum number of whitelisted addresses allowed

  // Wait for it to finish deploying
  await deployedWhitelistContract.deployed();

  // print the address of the deployed contract
  console.log("Whitelist Contract Address:", deployedWhitelistContract.address);

  // setTimeout(async () => {
  //   // verify contracts on explorer
  //   await run('verify:verify', {
  //     address: deployedWhitelistContract.address,
  //     constructorArguments: constructorArgs,
  //   });
  // }, 1000 * 60); // 60 secs
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
