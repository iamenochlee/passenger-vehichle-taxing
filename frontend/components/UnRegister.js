import React, { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Button, Input } from "web3uikit";
import { abi, contractAddresses } from "../constants";

const UNRegister = () => {
  const [id, setId] = useState(0);

  const {
    data,
    error,
    runContractFunction: UnRegister,
    isFetching,
    isLoading,
  } = useWeb3Contract();

  const options = {
    abi: abi,
    contractAddress: contractAddresses,
    functionName: "unRegister",
    params: {
      _passId: id,
    },
  };
  const handleUnRegister = async (e) => {
    e.preventDefault();
    await UnRegister({ params: options });
  };
  return (
    <div className="">
      <h2 className="mb-20 text-xl font-bold">UnRegister</h2>
      <h3 className="text-white">Ensure you have payed out your tax</h3>
      <form className="flex flex-col gap-7">
        <label htmlFor="id" className="text-white">
          enter your{" "}
          <strong className="underline text-yellow-400">passId</strong> for
          confirmation.
        </label>
        <Input
          id="id"
          type="number"
          value={id}
          label="passId"
          labelBgColor="black"
          onChange={(e) => setId(e.target.value)}
        />
        <Button
          onClick={(e) => handleUnRegister(e)}
          text="confirm"
          disabled={isFetching}
          theme="colored"
          color="yellow"
          className="bg-yellow-300 h-12"
          isFullWidth="true"
        />
      </form>
    </div>
  );
};

export default UNRegister;
