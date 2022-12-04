import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";

const View = () => {
  const [tripPrice, setTripPrice] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [driversCount, setDriversCount] = useState(0);
  const { isWeb3Enabled } = useMoralis();

  const { runContractFunction: getTripPrice } = useWeb3Contract({
    abi,
    contractAddress: contractAddresses,
    functionName: "s_tripPrice",
    params: {},
  });

  const { runContractFunction: getTaxRate } = useWeb3Contract({
    abi,
    contractAddress: contractAddresses,
    functionName: "getTaxRate",
    params: {},
  });

  const { runContractFunction: getDriversCount } = useWeb3Contract({
    abi,
    contractAddress: contractAddresses,
    functionName: "getDriversCount",
    params: {},
  });

  async function updateUIValues() {
    const taxRate = (await getTaxRate()).toString();
    const driversCount = (await getDriversCount()).toString();
    const tripPrice = (await getTripPrice()).toString();
    setTaxRate(taxRate);
    setDriversCount(driversCount);
    setTripPrice(tripPrice);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);
  return (
    <div>
      {isWeb3Enabled && (
        <div>
          <h3>{taxRate}</h3>
          <h3>{driversCount}</h3>
          <h3>{tripPrice}</h3>
        </div>
      )}
    </div>
  );
};

export default View;
