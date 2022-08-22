import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Main = ({ children, accountAddress, isConnected, requestAccounts }) => {
  return (
    <React.Fragment>
      <Header
        accountAddress={accountAddress}
        isConnected={isConnected}
        requestAccounts={requestAccounts}
      />
      <Content>
        <Sidebar />
        <MainContainer>{children}</MainContainer>
      </Content>
    </React.Fragment>
  );
};
const Content = styled.div`
  position: relative;
  top: 60px;
  width: 100%;
  height: 100%;
`;
const MainContainer = styled.div`
  margin-left: 15%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 85%;
  height: 100vh;
`;

export default Main;
