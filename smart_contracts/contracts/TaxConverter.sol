//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title A TaxConverter library
    @notice Generate tax in wei using this library
    @dev This library functions takes in arguments and returns taxamount in wei in relation to eth price in usd.
 */

library TaxConverter {
    /**
     * @notice This gets the amount of Ethereum in Wei based on ETH/USD price
        @dev This function comes from Chainlink Aggregator, giving way to get ETH price
        @param priceFeed a uinque address usee by Chainlink AggregatorV3Interface to get ETH price in USD
        @return ETH price in WEI
     */
    function _getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price / 10 ** 8);
    }

    /**
        @notice This gets calculates tax based on parameters given
        @dev This function comes from Chainlink AggregatorV3Interface giving way to get ETH price
        @param amountToBeTaxed the total amount to be taxed in USD
        @param taxRate the rate at which the tax is calculated, the given value is uded as a percentage
        @param priceFeed a uinque address usee by Chainlink AggregatorV3Interface to get
        * ETH price in USD, this address is passed to this function as it varies basedd on network.
        @return taxInWei tax amount in wei value
 */
    function _getTaxInWei(
        uint256 amountToBeTaxed,
        uint256 taxRate,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 taxAmount = ((amountToBeTaxed * taxRate) / 100);
        uint256 ethPriceInWei = _getPrice(priceFeed);
        uint256 taxInWei = ((taxAmount * 1e18) / ethPriceInWei);
        return taxInWei;
    }
}
