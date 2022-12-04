import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";

const Tax = () => {
  const [id, setId] = useState("0");
  const [tax, setTax] = useState("0");
  const { runContractFunction: getDriverTax } = useWeb3Contract({
    abi,
    contractAddress: contractAddresses,
    functionName: "getDriverTax",
    params: {
      _passId: id,
    },
  });

  async function updateTaxValue(e) {
    e.preventDefault();
    const tax = (await getDriverTax(id)).toString();
    setTax(tax);
  }

  return (
    <div>
      <h3>{tax}</h3>
      <form>
        <label htmlFor="id">type out your passId for confirmation</label>
        <input
          id="id"
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={(e) => updateTaxValue(e)}>confirm</button>
      </form>
    </div>
  );
};

export default Tax;
