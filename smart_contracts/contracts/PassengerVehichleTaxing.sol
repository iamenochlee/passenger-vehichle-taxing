// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
    @title A contract for Passenger Vehicle Taxing System
    @author iamenochlee
    @notice This smart contract eradicates automates bus taxes collection
    @dev A smart contract solution to passenger vehicle taxing system.
 */

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "./TaxConverter.sol";

//custom errors
error PassengerVehichleTaxing__NotPermitted(string message);
error PassengerVehichleTaxing__TransactionFailed();
error PassengerVehichleTaxing__InsufficientFunds(uint256 _bal, uint256 _tax);
error PassengerVehichleTaxing__InvalidInput(
    uint256 _minRequred,
    uint256 _maxRequired
);
error PassengerVehichleTaxing__RegistrationFailed(string message);
error PassengerVehichleTaxing__DriverNotFound(string message);

contract PassengerVehichleTaxing is AutomationCompatible {
    //library
    using TaxConverter for uint256;

    //variables
    address private immutable i_owner;
    uint256 public s_tripPrice = 5;
    uint256 private s_taxRate = 2;
    uint256 public s_minVehicleCapacity = 12;
    uint256 public s_maxVehicleCapacity = 24;
    uint256 public immutable INTERVAL;
    uint public lastTimeStamp;
    AggregatorV3Interface private s_priceFeed;

    //struct Array

    struct Driver {
        address addr;
        uint256 passId;
        string name;
        uint8 vehicleCapacity;
        uint256 tax;
        bool isWorking;
    }

    Driver[] public s_drivers;
    Driver[] private s_defaulters;
    //mapping
    mapping(uint256 => Driver) private s_idToDriver;

    //enums
    enum Status {
        OPEN,
        CALCULATING
    }

    Status public status;
    //events
    event Registered(
        uint256 indexed _passId,
        address indexed _address,
        uint256 _vehicleCapacity
    );

    event TaxPay(
        uint256 indexed _passId,
        address indexed _address,
        uint256 _amount
    );
    event UnRegistered(uint256 indexed _passId, address indexed _address);
    event TaxCalculated();
    event Withdrawn();

    //modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert PassengerVehichleTaxing__NotPermitted("Not Permitted");
        }
        _;
    }
    modifier onlyDriver() {
        Driver[] memory m_drivers = s_drivers;
        for (uint256 i; i < m_drivers.length; i++) {
            if (msg.sender != m_drivers[i].addr) {
                revert PassengerVehichleTaxing__NotPermitted("Not Permitted");
            }
        }
        _;
    }

    //constructor
    /** @notice This initializes parameters needed for the contract to run
        @dev A constructor function
        @param priceFeed a uinque address usee by Chainlink AggregatorV3Interface to get ETH price in USD
        @param interval the upkeep intrval
     */

    constructor(address priceFeed, uint256 interval) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeed);
        INTERVAL = interval;
        lastTimeStamp = block.timestamp;
    }

    //functions

    /**
    @notice registers a new driver
    @dev A register function to registera driver upon passing all requirements
    @param _passId the drivers passId, a unique number
    @param _name name of driver
    @param _vehicleCapacity the maximum capacity of the drivers vehicle
    */

    function register(
        uint256 _passId,
        string memory _name,
        uint8 _vehicleCapacity
    ) public {
        /// @notice confirming if registration is open
        if (status != Status.OPEN) {
            revert PassengerVehichleTaxing__NotPermitted(
                "Cant Register at this time"
            );
        }
        /// @dev copying drivers storage to memory so as to map through at a lower gas
        Driver[] memory m_drivers = s_drivers;
        /// @dev comfirming that driver has not been registered.
        for (uint256 i = 0; i < m_drivers.length; i++) {
            if (
                m_drivers[i].addr == msg.sender ||
                m_drivers[i].passId == _passId
            ) {
                /// @notice throwing an error if the driver has already registed
                revert PassengerVehichleTaxing__RegistrationFailed(
                    "Failed to register this account"
                );
            }
        }
        /// @dev checking if the driver vehichle capacity is in the allowed range

        if (
            _vehicleCapacity < s_minVehicleCapacity ||
            _vehicleCapacity > s_maxVehicleCapacity
        )
            /// @notice throwing an error if the driver has already registed
            revert PassengerVehichleTaxing__InvalidInput(
                12,
                s_maxVehicleCapacity
            );

        /// @dev pushing driver that meets the registration requirements
        s_drivers.push(
            Driver(msg.sender, _passId, _name, _vehicleCapacity, 0, true)
        );

        /// @notice taking note of the driver in a map
        s_idToDriver[_passId] = Driver(
            msg.sender,
            _passId,
            _name,
            _vehicleCapacity,
            0,
            true
        );

        /// @notice emitting a registration event
        emit Registered(_passId, msg.sender, _vehicleCapacity);
    }

    /** @notice handles the tax
        @dev handletax function calculates and set the tax for the driver that have a working status
    */

    function handleTax() internal {
        Driver[] memory m_drivers = s_drivers;

        for (uint256 i = 0; i < m_drivers.length; i++) {
            uint256 amountToBeTaxed = s_tripPrice *
                s_drivers[i].vehicleCapacity;
            /// @dev passing amount to be taxed,rate, s_priceFeed to _getTaxInWei from PriceConverter library
            /// @return _taxAmount amount of tax in wei value
            uint256 _taxAmount = amountToBeTaxed._getTaxInWei(
                s_taxRate,
                s_priceFeed
            );
            /// @dev making sure the driver has a working status and setting the tax amount for the driver
            if (s_drivers[i].isWorking == true) {
                s_drivers[i].tax += _taxAmount;
            } else {
                s_drivers[i].tax += 0;
            }
        }
    }

    /** 
    @notice this function take notes of defaulting drivers
    @dev handleDefaulters pushes defulting drivers to an array of defaulters
 */
    function handleDefaulters() internal {
        /// @dev copying drivers storage to memory so as to map through at a lower gas
        Driver[] memory m_drivers = s_drivers;
        for (uint256 i = 0; i < m_drivers.length; i++) {
            /// @dev checking for tax
            if (m_drivers[i].tax != 0) {
                s_defaulters.push(m_drivers[i]);
            } else if (m_drivers[i].tax == 0) {
                s_defaulters[i] = s_defaulters[s_defaulters.length - 1];
                s_defaulters.pop();
            }
        }
    }

    /**@notice pays the driver tax
        @dev drivers call this functio to pay off their tax 
    */

    function payTax() public payable onlyDriver {
        /// @dev requiring the contract staus to be open
        require(status == Status.OPEN, "Undergoing Daily Calculations");
        /// @dev copying drivers storage to memory so as to map through at a lower gas
        Driver[] memory m_drivers = s_drivers;
        /// @dev _passId is needed to emit taxpayed event
        uint256 _passId;
        for (uint256 i = 0; i < m_drivers.length; i++) {
            /// @dev a check to require that the caller is a registerd driver
            if (m_drivers[i].addr == msg.sender) {
                uint256 _tax = s_drivers[i].tax;
                _passId = s_drivers[i].passId;
                /// @dev ensuring the value sent is enough to clear the driver tax
                if (msg.value != _tax) {
                    /// @notice throwing an error on insufficient funds
                    revert PassengerVehichleTaxing__InsufficientFunds(
                        address(msg.sender).balance,
                        _tax
                    );
                }
                s_drivers[i].tax = 0;
            }
        }
        /// @dev emitting taxpayed event if all conditions are met
        emit TaxPay(_passId, msg.sender, msg.value);

        ///@dev resetting defaulters array
        handleDefaulters();
    }

    /// @notice toggles driver working status
    function turnOffWorkingStatus() public onlyDriver {
        /// @dev copying drivers storage to memory so as to map through at a lower gas
        Driver[] memory m_drivers = s_drivers;
        /// @dev ensuring that the caller is a registered driver
        for (uint256 i = 0; i < m_drivers.length; i++) {
            if (m_drivers[i].addr == msg.sender) {
                /// @dev toggling the driver working status
                s_drivers[i].isWorking = false;
            }
        }
    }

    /**@notice unregisters a driver
        @dev unregitered a driver, also ensuring that the driver has paid all defaulted tax
        @param _passId thsi is needed to confirm the drivers will to uregister
     */

    function unRegister(uint256 _passId) public virtual onlyDriver {
        /// @dev copying drivers storage to memory so as to map through at a lower gas
        Driver[] memory m_drivers = s_drivers;
        for (uint256 i = 0; i < m_drivers.length; i++) {
            if (m_drivers[i].addr == msg.sender) {
                /// @dev checking to make sure the driver has paid all tax
                if (s_drivers[i].tax != 0) {
                    revert PassengerVehichleTaxing__NotPermitted(
                        "pay out pending tax"
                    );
                }
                /// @dev moving the driver to the last index
                s_drivers[i] = s_drivers[s_drivers.length - 1];
                /// @dev removing the driver
                s_drivers.pop();
                delete s_idToDriver[_passId];
            }
        }

        /// @dev emitting an unregister event
        emit UnRegistered(_passId, msg.sender);
    }

    /// @notice withdraw function, only owner can call
    function withdraw() public payable onlyOwner {
        /// @dev owner cashout, lol
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        if (!success) revert PassengerVehichleTaxing__TransactionFailed();
        emit Withdrawn();
    }

    //getter functions

    /** @notice getsDriverTax
        @dev gets and returns the driver tax
        @param _passId the passid of the driver whose tax is requested
        @return tax the taxamountinwei corresponding to the driver 
     */
    function getDriverTax(uint256 _passId) public view returns (uint256) {
        /// @dev copying drivers storage to memory so as to map through at a lower gas
        Driver[] memory m_drivers = s_drivers;
        /// @dev creating a tax variable that will be assigned to the requested drivers tax
        uint256 _tax;
        for (uint256 i = 0; i < m_drivers.length; i++) {
            /// @dev checking if the driver exist user the passId
            if (m_drivers[i].passId != _passId) {
                /// @notice throwing an error if the passId is not found
                revert PassengerVehichleTaxing__DriverNotFound("");
            }
            /// @dev assigning the driver tax to tax variable
            _tax = s_drivers[i].tax;
        }
        /// @notice returning tax
        return _tax;
    }

    //getters
    /** @notice Gets a Driver using passId
     *  @param _passId the Id of the Driver and returns
     *  @return the driver struct
     */
    function getDriverWithId(
        uint256 _passId
    ) public view onlyOwner returns (Driver memory) {
        return s_idToDriver[_passId];
    }

    /**@notice getDrivers returns all drivers in an array
     *@return all Drivers
     */

    function getDrivers() public view onlyOwner returns (Driver[] memory) {
        return s_drivers;
    }

    /**  @notice all drivers count
     *   @return drivers count,  the owner calls this function to get the drivers count
     */
    function getDriversCount() public view onlyOwner returns (uint256) {
        return s_drivers.length;
    }

    /**  @notice all defaulters
     *   @return s_defaulters ,  the detailsof all defaulting drivers
     */
    function getDefaulters() public view onlyOwner returns (Driver[] memory) {
        return s_defaulters;
    }

    function getTaxRate() public view returns (uint256) {
        return s_taxRate;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    //setters
    /** @notice sets tripPrice to new trip price
     * @dev setPrice updates trip price, can only be called by the owner
     * @param _newTripPrice the new trip Price
     */
    function setPrice(uint256 _newTripPrice) public onlyOwner {
        s_tripPrice = _newTripPrice;
    }

    /** @notice sets maxVehicleCapacity to new maxVehicleCapacity
     * @dev setmaxVehicleCapacity updates s_maxVehicleCapacity, can only be called by the owner
     * @param _maxVehicleCapacity the new maximum ehicleCapacity
     */
    function setmaxVehicleCapacity(
        uint256 _maxVehicleCapacity
    ) public onlyOwner {
        s_maxVehicleCapacity = _maxVehicleCapacity;
    }

    /**  @notice sets setTaxRate to new taxRate
     * @dev setTaxRate updates s_taxRate, can only be called by the owner
     * @param _taxrate the new tax rate
     */

    function setTaxRate(uint256 _taxrate) public onlyOwner {
        s_taxRate = _taxrate;
    }

    //for testing purpose
    function tax() internal {
        status = Status.CALCULATING;
        handleTax();
        handleDefaulters();
        emit TaxCalculated();
        status = Status.OPEN;
        for (uint256 i = 0; i < s_drivers.length; i++) {
            /// @dev resetting the count for updating working status to 0
            s_drivers[i].isWorking = true;
        }
    }

    //Called by Chainlink Keepers to check if work needs to be done
    function checkUpkeep(
        bytes calldata /*checkData */
    ) external view returns (bool upkeepNeeded, bytes memory upKeepData) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > INTERVAL;
        return (upkeepNeeded, upKeepData);
    }

    //Called by Chainlink Keepers to handle work
    function performUpkeep(bytes calldata) external {
        if ((block.timestamp - lastTimeStamp) > INTERVAL) {
            tax();
            emit TaxCalculated();
            lastTimeStamp = block.timestamp;
        } else {
            revert("cant perform upkeep");
        }
    }

    //fallback

    /**  @notice both functions handles the situation whereby the contract  is interacted with indirectly
     *   @dev a fallback function
     */

    receive() external payable {
        payTax();
    }

    fallback() external payable {
        payTax();
    }
}
