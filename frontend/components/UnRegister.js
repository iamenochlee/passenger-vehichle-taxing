import React, { useState } from "react";
import { useWeb3Contract } from "react-moralis";
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
    functionName: "register",
    params: {
      _passId: id,
    },
  };
  const handleUnRegister = async (e) => {
    e.preventDefault();
    await UnRegister({ params: options });
  };
  return (
    <div>
      <h3>Ensure you have payed out your tax</h3>

      <form>
        <label htmlFor="id">type out your passId for confirmation</label>
        <input
          id="id"
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={(e) => handleUnRegister(e)}>confirm</button>
      </form>
    </div>
  );
};

export default UNRegister;
