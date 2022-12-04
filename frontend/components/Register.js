import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";

const Register = () => {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [vehileCapacity, setVehileCapacity] = useState(12);
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
    if (id || name || vehileCapacity !== null) {
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
      console.log(maxCapacity);
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      <h2>Register as a Driver</h2>
      <div>
        <form>
          <input
            type="number"
            placeholder="enter your Id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="text"
            placeholder="enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            min="12"
            max={maxCapacity}
            placeholder="enter your vehicle Capacity"
            value={vehileCapacity}
            onChange={(e) => setVehileCapacity(e.target.value)}
          />
          <button
            className="bg-red-500 p-5"
            onClick={(e) => handleRegister(e)}
            disabled={isFetching}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
