import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";

const View = () => {
  const [tripPrice, setTripPrice] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [driversCount, setDriversCount] = useState(0);
  const [driversStatus, setDriverStatus] = useState(true);
  const [tax, setTax] = useState(0);
  const { isWeb3Enabled } = useMoralis();

  const { runContractFunction: getDriverTax } = useWeb3Contract({
    abi,
    contractAddress: contractAddresses,
    functionName: "getDriverTax",
    params: {},
  });

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

  const { runContractFunction: getDriverStatus } = useWeb3Contract({
    abi,
    contractAddress: contractAddresses,
    functionName: "getDriverStatus",
    params: {},
  });

  async function updateUIValues() {
    const taxRate = (await getTaxRate())?.toString();
    const driversCount = (await getDriversCount())?.toString();
    const tripPrice = (await getTripPrice())?.toString();
    const tax = (await getDriverTax())?.toString();
    const driversStatus = (await getDriverStatus())?.toString();
    setTaxRate(taxRate);
    setDriversCount(driversCount);
    setTripPrice(tripPrice);
    setDriverStatus(driversStatus);
    setTax(tax);
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
          <h3 className="text-2xl absolute -top-20">
            {" "}
            Drivers: {driversCount}
          </h3>
          <div className="flex items-center gap-32">
            <h3>Tax Rate: {taxRate}%</h3>
            <h3>Trip Price: ${tripPrice}</h3>
          </div>

          <h3
            className={`text-xl ${
              driversStatus ? "text-green-500" : "text-gray-300"
            }`}>
            {driversStatus ? "active" : "inactive"}
          </h3>
          <h3 className="text-5xl">{tax}$ WEI</h3>
        </div>
      )}
    </div>
  );
};

export default View;
