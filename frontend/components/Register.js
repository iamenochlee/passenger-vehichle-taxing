import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";

const Register = () => {
  const { data, error, runContractFunction, isFetching, isLoading } =
    useWeb3Contract();

  const options = {
    abi: abi,
    contractAddress: contractAddresses,
    functionName: "register",
    params: {
      _passId: 125,
      _name: "son",
      _vehicleCapacity: 20,
    },
  };

  const { runContractFunction: register } = useWeb3Contract();

  return (
    <div>
      Register
      <button
        className="bg-red-500 p-5"
        onClick={() => register({ params: options })}
        disabled={isFetching}>
        Register
      </button>
      <div>
        {/* <button
          className="bg-red-500 p-5"
          onClick={() => unRegister({ params: optionsB })}
          disabled={isFetching}>
          unRegister
        </button> */}
      </div>
    </div>
  );
};

export default Register;
