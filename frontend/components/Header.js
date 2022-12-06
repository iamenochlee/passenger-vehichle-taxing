import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";

function Header() {
  return (
    <nav className="py-1 xl:py-2 xl:px-6 border-b-2 flex flex-row">
      <h1 className="py-4 px-4 font-bold text-xl xl:text-2xl text-white">
        Vehichle Taxing System
      </h1>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}

export default Header;
