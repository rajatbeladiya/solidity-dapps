const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("MultiSend", function () {
  it("Should pay everyone", async function () {
    const [deployer, account1, account2, account3, account4, account5] = await ethers.getSigners();
    const MultiSend = await ethers.getContractFactory("MultiSend");
    const multiSend = await MultiSend.deploy();
    await multiSend.deployed();
		
		const account1balance = await ethers.provider.getBalance(account1.address);
		const account2balance = await ethers.provider.getBalance(account2.address);
		const account3balance = await ethers.provider.getBalance(account3.address);
		const account4balance = await ethers.provider.getBalance(account4.address);
		const account5balance = await ethers.provider.getBalance(account5.address);
		
		await multiSend.connect(account1).multiSend(
			[account2.address, account3.address, account4.address, account5.address],
			ethers.utils.parseEther('1'),
			{ value: ethers.utils.parseEther('4') }
		);
		
		expect(Number(await ethers.provider.getBalance(account2.address))).to.equal(Number(account2balance) + Number(ethers.utils.parseEther('1')));
		expect(Number(await ethers.provider.getBalance(account3.address))).to.equal(Number(account3balance) + Number(ethers.utils.parseEther('1')));
		expect(Number(await ethers.provider.getBalance(account4.address))).to.equal(Number(account4balance) + Number(ethers.utils.parseEther('1')));
		expect(Number(await ethers.provider.getBalance(account5.address))).to.equal(Number(account5balance) + Number(ethers.utils.parseEther('1')));
		expect(Number(await ethers.provider.getBalance(account1.address))).lessThan(Number(account1balance) - Number(ethers.utils.parseEther('4')));
  });
});
