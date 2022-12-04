import React from "react";
import { useWeb3Contract } from "react-moralis";
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
    <div>
      Payment
      <button onClick={() => payTax({ params: options })}>Pay Tax</button>
    </div>
  );
};

export default Payment;
