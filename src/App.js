import Header from "./components/Header";
import React from "react";
import { GlobalStyles } from "./GlobalStyles";
import StakeRewardNCM from "./pages/StakeRewardNCM";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
function App() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");
  const [signer, setSigner] = useState();
  const { ethereum } = window;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  let signers;
  useEffect(() => {
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, []);

  useEffect(() => {
    requestAccounts();
  }, [provider]);

  useEffect(() => {
    ethereum?.on("accountsChanged", requestAccounts);
    return () => {
      ethereum?.removeListener("accountsChanged", requestAccounts);
    };
  });

  const requestAccounts = async () => {
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      await provider.send("eth_requestAccounts", []);
      signers = await provider.getSigner();
      setSigner(signers);
      setAccountAddress(await signer.getAddress());
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  return (
    <React.Fragment>
      <GlobalStyles />
      <Header accountAddress={accountAddress} />
      <StakeRewardNCM signer={signer} accountAddress={accountAddress} />
    </React.Fragment>
  );
}

export default App;
