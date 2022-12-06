import Head from "next/head";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import {
  Payment,
  UnregisterDriver,
  Header,
  View,
  Register,
  Status,
} from "../components";
import { abi, contractAddresses } from "../constants";

export default function Home() {
  const supportedChains = ["80001"];
  const { isWeb3Enabled, chainId, connector, account } = useMoralis();
  const [driverStatus, setDriverStatus] = useState(false);
  const { runContractFunction: isDriver } = useWeb3Contract({
    abi,
    contractAddress: contractAddresses,
    functionName: "isDriver",
    params: {},
  });

  const updateUI = async () => {
    const status = await isDriver();
    setDriverStatus(status);
  };

  useEffect(() => {
    updateUI();
    console.log(driverStatus);
  }, [isWeb3Enabled, driverStatus, connector, account]);

  return (
    <div className="h-screen">
      <Head>
        <title>Passenger Vehichle Taxing System</title>
        <meta
          name="description"
          content="A dApp that aims to solve the issue of taxation in transportation vehicles"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Header />
      </header>
      <main>
        {isWeb3Enabled ? (
          <div className="w-full grid place-items-center pt-32">
            {supportedChains.includes(parseInt(chainId).toString()) ? (
              <>
                {!driverStatus ? (
                  <Register isDriver={driverStatus} updateUI={updateUI} />
                ) : (
                  <div className="w-full">
                    <div className="text-white w-full flex p-32 flex-row-reverse  justify-between items-end gap-24 flex-wrap">
                      <UnregisterDriver updateUI={updateUI} />
                      <div className="relative flex flex-col gap-4">
                        <Status updateUI={updateUI} />
                        <View isDriver={driverStatus} />
                        <Payment updateUI={updateUI} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full">
                <h3 className="text-center mb-4 text-white text-xl font-bold">{`Please switch to Polygon Mumbai: ${supportedChains}`}</h3>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-center mb-4 text-xl font-bold mt-9 text-white">
              Please connect to a Wallet
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
