import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Button, Checkbox } from "web3uikit";
import { abi, contractAddresses } from "../constants";

const Status = () => {
  const [driversStatus, setDriverStatus] = useState(true);
  const { isWeb3Enabled } = useMoralis();
  const {
    data,
    error,
    runContractFunction: turnOffWorkingStatus,
    isFetching,
    isLoading,
  } = useWeb3Contract();

  const options = {
    abi: abi,
    contractAddress: contractAddresses,
    functionName: "turnOffWorkingStatus",
    params: {},
  };

  const { runContractFunction: getDriverStatus } = useWeb3Contract({
    abi,
    contractAddress: contractAddresses,
    functionName: "getDriverStatus",
    params: {},
  });

  async function updateUIValues() {
    const driversStatus = await getDriverStatus();
    setDriverStatus(driversStatus);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled, driversStatus]);

  return (
    <div className="text-white">
      <p className="mb-4">Active Status</p>
      <Checkbox
        onChange={() => turnOffWorkingStatus({ params: options })}
        label="switch off"
        name="checkbox"
        disabled={isFetching}
        checked={driversStatus}
        className="text-red-500"
      />
    </div>
  );
};

export default Status;
