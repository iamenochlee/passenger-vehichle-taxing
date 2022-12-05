# PassengerVehichleTaxing









## Methods

### INTERVAL

```solidity
function INTERVAL() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### checkUpkeep

```solidity
function checkUpkeep(bytes) external view returns (bool upkeepNeeded, bytes upKeepData)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | bytes | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| upkeepNeeded | bool | undefined |
| upKeepData | bytes | undefined |

### getDefaulters

```solidity
function getDefaulters() external view returns (struct PassengerVehichleTaxing.Driver[])
```

all defaulters




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | PassengerVehichleTaxing.Driver[] | s_defaulters ,  the detailsof all defaulting drivers |

### getDriverStatus

```solidity
function getDriverStatus() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### getDriverTax

```solidity
function getDriverTax() external view returns (uint256)
```

getsDriverTax




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | tax the taxamountinwei corresponding to the driver  |

### getDriverWithId

```solidity
function getDriverWithId(uint256 _passId) external view returns (struct PassengerVehichleTaxing.Driver)
```

Gets a Driver using passId



#### Parameters

| Name | Type | Description |
|---|---|---|
| _passId | uint256 | the Id of the Driver and returns |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | PassengerVehichleTaxing.Driver | the driver struct |

### getDrivers

```solidity
function getDrivers() external view returns (struct PassengerVehichleTaxing.Driver[])
```

getDrivers returns all drivers in an array




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | PassengerVehichleTaxing.Driver[] | all Drivers |

### getDriversCount

```solidity
function getDriversCount() external view returns (uint256)
```

all drivers count




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | drivers count,  the owner calls this function to get the drivers count |

### getOwner

```solidity
function getOwner() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### getPriceFeed

```solidity
function getPriceFeed() external view returns (contract AggregatorV3Interface)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract AggregatorV3Interface | undefined |

### getTaxRate

```solidity
function getTaxRate() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### isDriver

```solidity
function isDriver() external view returns (bool)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### lastTimeStamp

```solidity
function lastTimeStamp() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### payTax

```solidity
function payTax() external payable
```

pays the driver tax

*drivers call this functio to pay off their tax *


### performUpkeep

```solidity
function performUpkeep(bytes) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | bytes | undefined |

### register

```solidity
function register(uint256 _passId, string _name, uint8 _vehicleCapacity) external nonpayable
```

registers a new driver

*A register function to registera driver upon passing all requirements*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _passId | uint256 | the drivers passId, a unique number |
| _name | string | name of driver |
| _vehicleCapacity | uint8 | the maximum capacity of the drivers vehicle |

### s_drivers

```solidity
function s_drivers(uint256) external view returns (address addr, uint256 passId, string name, uint8 vehicleCapacity, uint256 tax, bool isWorking)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| addr | address | undefined |
| passId | uint256 | undefined |
| name | string | undefined |
| vehicleCapacity | uint8 | undefined |
| tax | uint256 | undefined |
| isWorking | bool | undefined |

### s_maxVehicleCapacity

```solidity
function s_maxVehicleCapacity() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### s_minVehicleCapacity

```solidity
function s_minVehicleCapacity() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### s_tripPrice

```solidity
function s_tripPrice() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### setPrice

```solidity
function setPrice(uint256 _newTripPrice) external nonpayable
```

sets tripPrice to new trip price

*setPrice updates trip price, can only be called by the owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _newTripPrice | uint256 | the new trip Price |

### setTaxRate

```solidity
function setTaxRate(uint256 _taxrate) external nonpayable
```

sets setTaxRate to new taxRate

*setTaxRate updates s_taxRate, can only be called by the owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _taxrate | uint256 | the new tax rate |

### setmaxVehicleCapacity

```solidity
function setmaxVehicleCapacity(uint256 _maxVehicleCapacity) external nonpayable
```

sets maxVehicleCapacity to new maxVehicleCapacity

*setmaxVehicleCapacity updates s_maxVehicleCapacity, can only be called by the owner*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _maxVehicleCapacity | uint256 | the new maximum ehicleCapacity |

### status

```solidity
function status() external view returns (enum PassengerVehichleTaxing.Status)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | enum PassengerVehichleTaxing.Status | undefined |

### turnOffWorkingStatus

```solidity
function turnOffWorkingStatus() external nonpayable
```

toggles driver working status




### unRegister

```solidity
function unRegister(uint256 _passId) external nonpayable
```

unregisters a driver

*unregitered a driver, also ensuring that the driver has paid all defaulted tax*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _passId | uint256 | thsi is needed to confirm the drivers will to uregister |

### withdraw

```solidity
function withdraw() external payable
```

withdraw function, only owner can call






## Events

### Registered

```solidity
event Registered(uint256 indexed _passId, address indexed _address, uint256 _vehicleCapacity)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _passId `indexed` | uint256 | undefined |
| _address `indexed` | address | undefined |
| _vehicleCapacity  | uint256 | undefined |

### TaxCalculated

```solidity
event TaxCalculated()
```






### TaxPay

```solidity
event TaxPay(uint256 indexed _passId, address indexed _address, uint256 _amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _passId `indexed` | uint256 | undefined |
| _address `indexed` | address | undefined |
| _amount  | uint256 | undefined |

### UnRegistered

```solidity
event UnRegistered(uint256 indexed _passId, address indexed _address)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _passId `indexed` | uint256 | undefined |
| _address `indexed` | address | undefined |

### Withdrawn

```solidity
event Withdrawn()
```








## Errors

### OnlySimulatedBackend

```solidity
error OnlySimulatedBackend()
```






### PassengerVehichleTaxing__DriverNotFound

```solidity
error PassengerVehichleTaxing__DriverNotFound(string message)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| message | string | undefined |

### PassengerVehichleTaxing__InsufficientFunds

```solidity
error PassengerVehichleTaxing__InsufficientFunds(uint256 _bal, uint256 _tax)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _bal | uint256 | undefined |
| _tax | uint256 | undefined |

### PassengerVehichleTaxing__InvalidInput

```solidity
error PassengerVehichleTaxing__InvalidInput(uint256 _minRequred, uint256 _maxRequired)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _minRequred | uint256 | undefined |
| _maxRequired | uint256 | undefined |

### PassengerVehichleTaxing__NotPermitted

```solidity
error PassengerVehichleTaxing__NotPermitted(string message)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| message | string | undefined |

### PassengerVehichleTaxing__RegistrationFailed

```solidity
error PassengerVehichleTaxing__RegistrationFailed(string message)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| message | string | undefined |

### PassengerVehichleTaxing__TransactionFailed

```solidity
error PassengerVehichleTaxing__TransactionFailed()
```







