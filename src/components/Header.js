import React from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";

const Header = ({ accountAddress, isConnected, requestAccounts }) => {
  return (
    <HeaderPane>
      <Container>
        <div className="info">
          <p className="title">Demo Solidity</p>
          <div className="logo__image">
            <img src={logo} alt="" className="logo" />
          </div>
        </div>
        {isConnected ? (
          <div className="connect-btn">
            <p>Address: {accountAddress}</p>
          </div>
        ) : (
          <div className="connect-btn" onClick={()=>requestAccounts()}>
            <p>Connect Wallet</p>
          </div>
        )}
      </Container>
    </HeaderPane>
  );
};

const HeaderPane = styled.div`
  height: 60px;
  background-color: #000;
`;
const Container = styled.div`
  max-width: 1170px;
  margin: 0 auto;
  padding: 0 15px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .info {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    .logo__image {
      width: 45px;
      height: 45px;
      .logo {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      color: #ffcc00;
      font-size: 40px;
      font-weight: 500;
    }
  }
  .connect-btn {
    margin-left: auto;
    background-color: #ffcc00;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      filter: brightness(1.1);
      transition:all ease 0.3s;
    }
  }
`;

export default Header;
