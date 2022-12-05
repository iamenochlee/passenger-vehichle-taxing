import { useEffect, useRef, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Button, Input } from "web3uikit";
import { abi, contractAddresses } from "../constants";

const Register = () => {
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const [vehileCapacity, setVehichleCapacity] = useState();
  const [maxCapacity, setMaxCapacity] = useState(20);
  const { isWeb3Enabled } = useMoralis();

  const {
    data,
    error,
    runContractFunction: register,
    isFetching,
    isLoading,
  } = useWeb3Contract();

  const options = {
    abi: abi,
    contractAddress: contractAddresses,
    functionName: "register",
    params: {
      _passId: id,
      _name: name,
      _vehicleCapacity: vehileCapacity,
    },
  };

  const details = {
    abi: abi,
    contractAddress: contractAddresses,
    functionName: "s_maxVehicleCapacity",
    params: {},
  };

  const { runContractFunction: s_maxVehicleCapacity } = useWeb3Contract();

  const handleRegister = (e) => {
    e.preventDefault();
    if (id || name || vehileCapacity !== null || "") {
      register({ params: options });
    }
  };

  useEffect(() => {
    async function resolveMax() {
      const max = await s_maxVehicleCapacity({ params: details });
      setMaxCapacity(max);
    }
    if (isWeb3Enabled) {
      resolveMax();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="px-36">
      <h2 className="text-center mb-4 text-xl font-bold text-white">
        Register as a Driver
      </h2>
      <div className="w-full px-20">
        <form className="w-full flex flex-col gap-8">
          <Input
            value={id}
            type="number"
            min="1"
            placeholder="passId"
            max="3000"
            onChange={(e) => setId(e.target.value)}
          />
          <Input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            min="12"
            max={maxCapacity}
            placeholder="vehicleCapacity"
            value={vehileCapacity}
            onChange={(e) => setVehichleCapacity(e.target.value)}
          />
          <Button
            onClick={(e) => handleRegister(e)}
            disabled={isFetching}
            text="Register"
            theme="colored"
            color="yellow"
            className="h-12"
            isFullWidth="true"
            style={{ color: "gray" }}
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
