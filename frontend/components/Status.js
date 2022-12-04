import React from "react";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";

const Status = () => {
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

  return (
    <div>
      Status
      <button
        onClick={() => turnOffWorkingStatus({ params: options })}></button>
    </div>
  );
};

export default Status;
