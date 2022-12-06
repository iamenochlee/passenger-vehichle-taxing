import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Button, Checkbox, useNotification } from "web3uikit";
import { abi, contractAddresses } from "../constants";

const Status = ({ updateUI }) => {
  const dispatch = useNotification();

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Working Status turned off!",
      title: "Status Updated",
      position: "topR",
    });
  };

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
  const handleSuccess = async () => {
    try {
      updateUI();
      handleNewNotification();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    async function updateUIValues() {
      const driversStatus = await getDriverStatus();
      setDriverStatus(driversStatus);
    }
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled, driversStatus]);

  async function handleWorkingStatus() {
    await turnOffWorkingStatus({ params: options, onSuccess: handleSuccess });
  }
  return (
    <div className="text-white">
      <p className="mb-4">Active Status</p>
      <Checkbox
        onChange={handleWorkingStatus}
        label="switch off"
        name="checkbox"
        disabled={isLoading || isFetching}
        checked={driversStatus}
        className="text-red-500"
      />
    </div>
  );
};

export default Status;
