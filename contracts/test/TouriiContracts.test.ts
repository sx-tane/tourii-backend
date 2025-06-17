import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Tourii Smart Contracts", function () {
  
  async function deployContractsFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy TouriiDigitalPassport
    const TouriiDigitalPassport = await ethers.getContractFactory("TouriiDigitalPassport");
    const baseURI = "https://api.tourii.com/api/passport/metadata/";
    const digitalPassport = await TouriiDigitalPassport.deploy(baseURI);
    
    // Deploy TouriiPerk
    const TouriiPerk = await ethers.getContractFactory("TouriiPerk");
    const perk = await TouriiPerk.deploy("Test Perk Collection", "TESTPERK");
    
    // Deploy TouriiLog
    const TouriiLog = await ethers.getContractFactory("TouriiLog");
    const log = await TouriiLog.deploy();

    return { digitalPassport, perk, log, owner, addr1, addr2 };
  }

  describe("TouriiDigitalPassport", function () {
    it("Should deploy and have correct name", async function () {
      const { digitalPassport } = await loadFixture(deployContractsFixture);
      expect(await digitalPassport.name()).to.equal("Tourii Digital Passport");
      expect(await digitalPassport.symbol()).to.equal("TOURII");
    });

    it("Should mint passport to user", async function () {
      const { digitalPassport, owner, addr1 } = await loadFixture(deployContractsFixture);
      
      await digitalPassport.mint(addr1.address);
      
      expect(await digitalPassport.ownerOf(0)).to.equal(addr1.address);
      expect(await digitalPassport.tokenURI(0)).to.equal("https://api.tourii.com/api/passport/metadata/0.json");
      expect(await digitalPassport.hasPassport(addr1.address)).to.be.true;
      expect(await digitalPassport.userPassportId(addr1.address)).to.equal(0);
    });

    it("Should prevent minting multiple passports to same address", async function () {
      const { digitalPassport, addr1 } = await loadFixture(deployContractsFixture);
      
      await digitalPassport.mint(addr1.address);
      
      await expect(
        digitalPassport.mint(addr1.address)
      ).to.be.revertedWith("Address already has a passport");
    });

    it("Should update base URI", async function () {
      const { digitalPassport, addr1 } = await loadFixture(deployContractsFixture);
      
      await digitalPassport.mint(addr1.address);
      const newBaseURI = "https://newapi.tourii.com/api/passport/metadata/";
      
      await digitalPassport.updateBaseURI(newBaseURI);
      expect(await digitalPassport.tokenURI(0)).to.equal("https://newapi.tourii.com/api/passport/metadata/0.json");
      expect(await digitalPassport.baseURI()).to.equal(newBaseURI);
    });
  });

  describe("TouriiPerk", function () {
    it("Should deploy with correct name and symbol", async function () {
      const { perk } = await loadFixture(deployContractsFixture);
      expect(await perk.name()).to.equal("Test Perk Collection");
      expect(await perk.symbol()).to.equal("TESTPERK");
    });

    it("Should mint perk to user", async function () {
      const { perk, addr1 } = await loadFixture(deployContractsFixture);
      
      const tokenURI = "https://metadata.tourii.com/perk/1.json";
      await perk.mint(addr1.address, tokenURI);
      
      expect(await perk.ownerOf(0)).to.equal(addr1.address);
      expect(await perk.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should allow perk redemption", async function () {
      const { perk, addr1 } = await loadFixture(deployContractsFixture);
      
      await perk.mint(addr1.address, "uri");
      
      await perk.connect(addr1).redeemPerk(0);
      expect(await perk.isRedeemed(0)).to.be.true;
    });

    it("Should burn perk", async function () {
      const { perk, addr1 } = await loadFixture(deployContractsFixture);
      
      await perk.mint(addr1.address, "uri");
      await perk.connect(addr1).burn(0);
      
      await expect(perk.ownerOf(0)).to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("TouriiLog", function () {
    it("Should deploy with correct name", async function () {
      const { log } = await loadFixture(deployContractsFixture);
      expect(await log.name()).to.equal("Tourii Log");
      expect(await log.symbol()).to.equal("TOURIILOG");
    });

    it("Should mint log with category", async function () {
      const { log, addr1 } = await loadFixture(deployContractsFixture);
      
      const tokenURI = "https://metadata.tourii.com/log/1.json";
      const category = "milestone";
      
      await log.mint(addr1.address, tokenURI, category);
      
      expect(await log.ownerOf(0)).to.equal(addr1.address);
      expect(await log.tokenURI(0)).to.equal(tokenURI);
      expect(await log.logCategory(0)).to.equal(category);
    });

    it("Should track user logs", async function () {
      const { log, addr1 } = await loadFixture(deployContractsFixture);
      
      await log.mint(addr1.address, "uri1", "category1");
      await log.mint(addr1.address, "uri2", "category2");
      
      const userLogs = await log.getUserLogs(addr1.address);
      expect(userLogs.length).to.equal(2);
      expect(userLogs[0]).to.equal(0);
      expect(userLogs[1]).to.equal(1);
    });
  });
});