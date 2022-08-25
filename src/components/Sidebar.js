import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <SidebarPane>
      <Menu>
        <Item>
          <Link to={"/"}>Stake & Reward</Link>
        </Item>
        <Item>
          <Link to={"/ico"}>ICO</Link>
        </Item>
        <Item>
          <Link to={"/airdrop"}>Airdrop</Link>
        </Item>
      </Menu>
    </SidebarPane>
  );
};

const SidebarPane = styled.div`
  position: fixed;
  z-index: 9;
  height: 100%;
  width: 15%;
  background-color: #000;
`;
const Menu = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Item = styled.li`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  &:hover {
    background-color: rgb(64, 64, 64);
    transition: all ease 0.5s;
  }
  &:active {
    background-color: rgb(64, 64, 64);
    transition: all ease 0.5s;
  }
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: #ffcc00;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 1.1;
  }
`;

export default Sidebar;
