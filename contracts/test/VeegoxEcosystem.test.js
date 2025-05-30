
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VeegoxEcosystem", function () {
  let veegoxEcosystem;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const VeegoxEcosystem = await ethers.getContractFactory("VeegoxEcosystem");
    veegoxEcosystem = await VeegoxEcosystem.deploy();
    await veegoxEcosystem.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await veegoxEcosystem.owner()).to.equal(owner.address);
    });

    it("Should assign initial VEX supply to owner", async function () {
      const ownerBalance = await veegoxEcosystem.balanceOf(owner.address, 0); // TokenType.VEX = 0
      expect(ownerBalance).to.equal(ethers.utils.parseEther("1000000"));
    });
  });

  describe("Token Minting", function () {
    it("Should mint VEX tokens", async function () {
      await veegoxEcosystem.mintVEX(addr1.address, ethers.utils.parseEther("1000"));
      expect(await veegoxEcosystem.balanceOf(addr1.address, 0)).to.equal(
        ethers.utils.parseEther("1000")
      );
    });

    it("Should mint sVEX tokens", async function () {
      await veegoxEcosystem.mintSVEX(addr1.address, ethers.utils.parseEther("500"));
      expect(await veegoxEcosystem.balanceOf(addr1.address, 1)).to.equal(
        ethers.utils.parseEther("500")
      );
    });

    it("Should mint gVEX tokens", async function () {
      await veegoxEcosystem.mintGVEX(addr1.address, ethers.utils.parseEther("100"));
      expect(await veegoxEcosystem.balanceOf(addr1.address, 2)).to.equal(
        ethers.utils.parseEther("100")
      );
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      // Mint some VEX to addr1 for testing
      await veegoxEcosystem.mintVEX(addr1.address, ethers.utils.parseEther("1000"));
    });

    it("Should allow staking VEX", async function () {
      await veegoxEcosystem.connect(addr1).stakeVEX(ethers.utils.parseEther("100"));
      
      const stake = await veegoxEcosystem.stakes(addr1.address);
      expect(stake.amount).to.equal(ethers.utils.parseEther("100"));
    });

    it("Should calculate rewards correctly", async function () {
      await veegoxEcosystem.connect(addr1).stakeVEX(ethers.utils.parseEther("100"));
      
      // Fast forward time by 1 day
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine");
      
      const rewards = await veegoxEcosystem.calculateRewards(addr1.address);
      expect(rewards).to.be.gt(0);
    });
  });

  describe("Governance", function () {
    beforeEach(async function () {
      // Mint gVEX to addr1 for governance
      await veegoxEcosystem.mintGVEX(addr1.address, ethers.utils.parseEther("2000"));
    });

    it("Should allow creating proposals", async function () {
      await veegoxEcosystem.connect(addr1).createProposal("Test Proposal", "This is a test");
      
      const proposal = await veegoxEcosystem.proposals(0);
      expect(proposal.title).to.equal("Test Proposal");
      expect(proposal.proposer).to.equal(addr1.address);
    });

    it("Should allow voting on proposals", async function () {
      await veegoxEcosystem.connect(addr1).createProposal("Test Proposal", "This is a test");
      await veegoxEcosystem.connect(addr1).vote(0, true);
      
      const proposal = await veegoxEcosystem.proposals(0);
      expect(proposal.votesFor).to.equal(ethers.utils.parseEther("2000"));
    });
  });

  describe("Swapping", function () {
    beforeEach(async function () {
      await veegoxEcosystem.mintVEX(addr1.address, ethers.utils.parseEther("1000"));
      await veegoxEcosystem.mintSVEX(addr1.address, ethers.utils.parseEther("1000"));
    });

    it("Should allow swapping VEX to sVEX", async function () {
      const initialVEX = await veegoxEcosystem.balanceOf(addr1.address, 0);
      const initialSVEX = await veegoxEcosystem.balanceOf(addr1.address, 1);
      
      await veegoxEcosystem.connect(addr1).swapVEXToSVEX(ethers.utils.parseEther("100"));
      
      const finalVEX = await veegoxEcosystem.balanceOf(addr1.address, 0);
      const finalSVEX = await veegoxEcosystem.balanceOf(addr1.address, 1);
      
      expect(finalVEX).to.be.lt(initialVEX);
      expect(finalSVEX).to.be.gt(initialSVEX);
    });

    it("Should allow swapping sVEX to VEX", async function () {
      const initialVEX = await veegoxEcosystem.balanceOf(addr1.address, 0);
      const initialSVEX = await veegoxEcosystem.balanceOf(addr1.address, 1);
      
      await veegoxEcosystem.connect(addr1).swapSVEXToVEX(ethers.utils.parseEther("100"));
      
      const finalVEX = await veegoxEcosystem.balanceOf(addr1.address, 0);
      const finalSVEX = await veegoxEcosystem.balanceOf(addr1.address, 1);
      
      expect(finalVEX).to.be.gt(initialVEX);
      expect(finalSVEX).to.be.lt(initialSVEX);
    });
  });
});
