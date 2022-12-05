import React from "react";
import { useWeb3Contract } from "react-moralis";
import { Button } from "web3uikit";
import { abi, contractAddresses } from "../constants";

const Payment = () => {
  const {
    data,
    error,
    runContractFunction: payTax,
    isFetching,
    isLoading,
  } = useWeb3Contract();

  const options = {
    abi: abi,
    contractAddress: contractAddresses,
    functionName: "payTax",
    params: {},
  };
  return (
    <div className="w-full mt-3">
      <Button
        onClick={() => payTax({ params: options })}
        text="Pay Tax"
        disabled={isFetching}
        theme="colored"
        color="blue"
        className="h-12"
        isFullWidth
      />
    </div>
  );
};

export default Payment;
