import React from "react";
import styled from "styled-components";
import Header from "./Header";

const Main = ({ children, accountAddress, isConnected, requestAccounts }) => {
  return (
    <React.Fragment>
      <Header accountAddress={accountAddress} isConnected={isConnected} requestAccounts={requestAccounts}/>
      <MainContainer>{children}</MainContainer>
    </React.Fragment>
  );
};
const MainContainer = styled.div`
  margin-top: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-width: 1170px;
  margin: 0 auto;
  padding: 0 15px;
`;

export default Main;
