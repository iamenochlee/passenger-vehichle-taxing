import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Bell, Button, Input, useNotification } from "web3uikit";
import { abi, contractAddresses } from "../constants";

const Register = ({ isDriver, updateUI }) => {
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const [vehileCapacity, setVehichleCapacity] = useState();
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [errormessage, setError] = useState("");
  const { isWeb3Enabled } = useMoralis();

  const dispatch = useNotification();
  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: `registered successfully with passId: ${id}`,
      title: "Register",
      position: "topR",
    });
  };
  const handleNewNotificationError = () => {
    dispatch({
      type: "error",
      message: `Failed to register, passId is taken`,
      title: "Unregistering",
      position: "topR",
    });
  };

  const handleSuccess = async () => {
    try {
      updateUI();
      handleNewNotification();
      setError("please refresh");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (id || name || vehileCapacity !== null || "") {
      if (vehileCapacity <= maxCapacity) {
        setError("");
        await register({
          params: options,
          onSuccess: handleSuccess,
          onError: handleError,
        });
      } else {
        setError("invalid vehichle Capacity");
      }
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
  }, [isWeb3Enabled, isDriver]);

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
            onClick={(e) => {
              handleRegister(e);
            }}
            disabled={isFetching}
            text="Register"
            theme="colored"
            color="yellow"
            className="h-12"
            isFullWidth="true"
            style={{ color: "gray" }}
          />
          <p className="text-red-400 -mt-5">{errormessage}</p>
        </form>
      </div>
      <div className="text-white flex flex-col items-center gap-1 mt-6">
        <strong>NOTE:</strong> This is a demo dApp
        <p>passId can be any number within uint256</p>
        <p>busCapacity ranges from 12 to {maxCapacity.toString()}</p>
      </div>
    </div>
  );
};

export default Register;
