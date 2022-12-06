import React from "react";
import { useWeb3Contract } from "react-moralis";
import { Button, useNotification } from "web3uikit";
import { abi, contractAddresses } from "../constants";

const Payment = ({ updateUI }) => {
  const dispatch = useNotification();

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "payed out",
      title: "Payment",
      position: "topR",
    });
  };
  const handleNewNotificationError = () => {
    dispatch({
      type: "error",
      message: "insufficient funds",
      title: "Payment",
      position: "topR",
    });
  };

  const handleSuccess = async () => {
    try {
      updateUI();
      handleNewNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const handleError = async () => {
    try {
      updateUI();
      handleNewNotificationError();
    } catch (error) {
      console.log(error);
    }
  };
  const {
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
        onClick={async () => {
          await payTax({
            params: options,
            onSuccess: handleSuccess,
            onError: handleError,
          });
        }}
        text="Pay Tax"
        disabled={isLoading || isFetching}
        theme="colored"
        color="blue"
        className="h-12"
        isFullWidth
      />
    </div>
  );
};

export default Payment;
