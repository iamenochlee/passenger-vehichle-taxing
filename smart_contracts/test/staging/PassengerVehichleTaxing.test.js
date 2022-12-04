const { assert, expect } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat");

("use strict");
//
developmentChains.includes(network.name)
  ? describe.skip
  : describe("PassengerVehichleTaxing", () => {
      let PassengerVehichleTaxing, mockV3Aggregator, deployer, accounts, owner;
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        PassengerVehichleTaxing = await ethers.getContract(
          "BusTaxing",
          deployer
        );
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
        accounts = await ethers.getSigners();
        owner = await PassengerVehichleTaxing.getOwner();
      });
      describe("constructor", () => {
        it("sets the aggregator addresses correctly", async () => {
          const response = await PassengerVehichleTaxing.getPriceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });

        it("sets interval correctly", async () => {
          const response = await PassengerVehichleTaxing.INTERVAL();
          assert.equal(response, parseInt(INTERVAL));
        });
      });
      describe("ownership", () => {
        it("sets the contract owner correctly", async () => {
          assert.equal(owner, deployer);
        });
      });
    });
