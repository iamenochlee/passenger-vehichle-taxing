import Head from "next/head";
import { useMoralis } from "react-moralis";
import Register from "../components/Register";
import UNRegister from "../components/UnRegister";
import View from "../components/View";
import Account from "./account";
import Payment from "../components/Payment";
import Tax from "../components/Tax";

export default function Home() {
  const supportedChains = ["80001"];
  const { isWeb3Enabled, chainId } = useMoralis();
  return (
    <div className="">
      <Head>
        <title>Passenger Vehichle Taxing System</title>
        <meta
          name="description"
          content="A dApp that aims to solve the issue of taxation in transportation vehicles"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full">
        <Account />
        {isWeb3Enabled ? (
          <div>
            {supportedChains.includes(parseInt(chainId).toString()) ? (
              <div className="flex flex-row">
                <Register />
                <UNRegister />
                <View />
                <Payment />
                <Tax />
              </div>
            ) : (
              <div>{`Please switch to Polygon Mumbai: ${supportedChains}`}</div>
            )}
          </div>
        ) : (
          <div>Please connect to a Wallet</div>
        )}
      </main>
    </div>
  );
}
