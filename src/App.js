import Header from "./components/Header";
import React from "react";
import { GlobalStyles } from "./GlobalStyles";
import StakeRewardNCM from "./pages/StakeRewardNCM";
import Main from "./components/Main";
import ICO from "./pages/ICO";
import { Routes, Route } from "react-router-dom";
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
      setAccountAddress(null);
    }
  };

  return (
    <React.Fragment>
      <GlobalStyles />
      <Main
        accountAddress={accountAddress}
        isConnected={isConnected}
        requestAccounts={requestAccounts}
      >
        <Routes>
          <Route
            path="/"
            element={
              <StakeRewardNCM signer={signer} accountAddress={accountAddress} />
            }
          />
          <Route
            path="/ICO"
            element={<ICO signer={signer} accountAddress={accountAddress} />}
          />
        </Routes>
      </Main>
    </React.Fragment>
  );
}

export default App;
