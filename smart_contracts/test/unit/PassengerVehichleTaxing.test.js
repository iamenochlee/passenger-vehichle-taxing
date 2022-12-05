const { assert, expect } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat");
require("dotenv").config();
const INTERVAL = process.env.INTERVAL;

("use strict");
//
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("PassengerVehichleTaxing", () => {
      let PassengerVehichleTaxing, mockV3Aggregator, deployer, accounts, owner;
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        PassengerVehichleTaxing = await ethers.getContract(
          "PassengerVehichleTaxing",
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
        it("sets the minvehiclecapacity correctly", async () => {
          const minCapacity = 12;
          const response = await PassengerVehichleTaxing.s_minVehicleCapacity();
          assert.equal(response, minCapacity);
        });
      });
      describe("ownership", () => {
        it("sets the contract owner correctly", async () => {
          assert.equal(owner, deployer);
        });
      });
      describe("default values", () => {
        it("All variables should be properly initiliazed", async () => {
          const DdriversCount = 0,
            Ddefaulters = 0,
            DtaxRate = 2;
          const driversCount = await PassengerVehichleTaxing.getDriversCount();
          const defaulters = await PassengerVehichleTaxing.getDefaulters();
          const taxRate = await PassengerVehichleTaxing.getTaxRate();
          assert.equal(driversCount, DdriversCount);
          assert.equal(defaulters.length, Ddefaulters);
          assert.equal(taxRate, DtaxRate);
        });
      });
      describe("setting values", () => {
        it("variables values should update on change", async () => {
          const ntaxRate = 4,
            nMaxCapacity = 30,
            price = 2;
          await PassengerVehichleTaxing.setTaxRate(ntaxRate);
          await PassengerVehichleTaxing.setmaxVehicleCapacity(nMaxCapacity);
          await PassengerVehichleTaxing.setPrice(price);

          const taxRate = await PassengerVehichleTaxing.getTaxRate();
          const maxCapacity = await PassengerVehichleTaxing.s_maxVehicleCapacity();
          const PRICE = await PassengerVehichleTaxing.s_tripPrice();
          assert.equal(taxRate, ntaxRate);
          assert.equal(maxCapacity, nMaxCapacity);
          assert.equal(PRICE, price);
        });
      });
      describe("registering, taxing, paying, and unregistering", () => {
        let TxResponse;
        beforeEach(async () => {
          TxResponse = await PassengerVehichleTaxing.connect(
            accounts[1]
          ).register(123, "Bob", 18);
          TxResponse.wait(2);
        });
        it("should emits event on registration", async () => {
          await expect(TxResponse).to.emit(
            PassengerVehichleTaxing,
            "Registered"
          );
        });
        it("should confirm the driver's legitimacy", async () => {
          expect(
            await PassengerVehichleTaxing.connect(accounts[1]).isDriver()
          ).to.equal(true);
        });
        it("should add the driver that passes the registration requirements", async () => {
          const ndriversCount = 1;
          const driversCount = await PassengerVehichleTaxing.getDriversCount();
          assert.equal(driversCount.toNumber(), ndriversCount);
        });
        it("should not allow the same id to register", async () => {
          await expect(
            PassengerVehichleTaxing.register(123, "lee", 20)
          ).to.revertedWithCustomError(
            PassengerVehichleTaxing,
            "PassengerVehichleTaxing__RegistrationFailed"
          );
        });
        describe("handling inactive drivers", () => {
          beforeEach(async () => {
            PassengerVehichleTaxing.connect(accounts[1]).turnOffWorkingStatus();
          });
          it("should update the driver status", async () => {
            const status = await PassengerVehichleTaxing.connect(
              accounts[1]
            ).getDriverStatus();
            assert.equal(status, false);
          });
        });
        describe("handling tax", () => {
          let tax, TxResponse;
          beforeEach(async () => {
            await network.provider.send("evm_increaseTime", [
              parseInt(INTERVAL) + 1,
            ]);
            await network.provider.request({ method: "evm_mine", params: [] });
            await PassengerVehichleTaxing.checkUpkeep("0x");
            TxResponse = await PassengerVehichleTaxing.performUpkeep("0x");
          });
          it("shouldn't perform upkeep before time", async () => {
            await expect(
              PassengerVehichleTaxing.performUpkeep("0x")
            ).revertedWith("cant perform upkeep");
          });
          it("emits event on perform upkeep", async () => {
            expect(TxResponse).to.emit("TaxCalculated");
          });
          it("should update the driver tax", async () => {
            tax = await PassengerVehichleTaxing.connect(
              accounts[1]
            ).getDriverTax();
            expect(tax.toString()).not.equal("0");
          });
          it("should handle for wrong driver pass", async () => {
            await expect(
              PassengerVehichleTaxing.connect(accounts[2]).getDriverTax()
            ).to.revertedWithCustomError(
              PassengerVehichleTaxing,
              "PassengerVehichleTaxing__DriverNotFound"
            );
          });

          it("should add the driver to the defaulters", async () => {
            const defaulters = await PassengerVehichleTaxing.getDefaulters();
            expect(defaulters[0].addr).equal(accounts[1].address);
          });
          it("should revert on attempt to unregister without settling tax", async () => {
            await expect(
              PassengerVehichleTaxing.connect(accounts[1]).unRegister(123)
            ).revertedWithCustomError(
              PassengerVehichleTaxing,
              "PassengerVehichleTaxing__NotPermitted"
            );
          });
          describe("taxPayment", () => {
            let TxResponse;
            beforeEach(async () => {
              TxResponse = await PassengerVehichleTaxing.connect(
                accounts[1]
              ).payTax({ value: tax });
              TxResponse.wait();
            });
            it("should pay out the tax", async () => {
              const taxAmount = await PassengerVehichleTaxing.connect(
                accounts[1]
              ).getDriverTax();
              assert.equal(taxAmount.toString(), "0");
            });
            it("should emits event on tax payment", async () => {
              await expect(TxResponse).to.emit(
                PassengerVehichleTaxing,
                "TaxPay"
              );
            });
            it("should remove the driver from the defaulters", async () => {
              const defaulters = await PassengerVehichleTaxing.getDefaulters();
              expect(defaulters.length).to.equal(0);
            });
            it("should allow a driver with no tax debt to unregister and update the drivers array", async () => {
              const TxResponse = await PassengerVehichleTaxing.connect(
                accounts[1]
              ).unRegister(123);
              const driversCount = await PassengerVehichleTaxing.getDriversCount();
              assert.equal(driversCount, 0);
              await expect(TxResponse).to.emit(
                PassengerVehichleTaxing,
                "UnRegistered"
              );
            });
          });
        });
      });
      describe("withdrawing", () => {
        let TxResponse;
        beforeEach(async () => {
          TxResponse = await PassengerVehichleTaxing.withdraw();
        });
        it("should allow only the owner to withdraw", async () => {
          await expect(TxResponse).not.to.revertedWithCustomError(
            PassengerVehichleTaxing,
            "PassengerVehichleTaxing__NotPermitted"
          );
        });
        it("should emit event on withdraw", async () => {
          expect(TxResponse).to.emit(PassengerVehichleTaxing, "");
        });
        it("should deduct all funds from the contract", async () => {
          const provider = ethers.provider;
          expect(
            await provider.getBalance(PassengerVehichleTaxing.address)
          ).to.equal(0);
        });
      });
    });
