import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MyTokenABI from "../contracts/MyToken.json";
import MTK_Token from "../contracts/MTK_Token.json"
import MTK_ICO from "../contracts/MTK_ICO.json";
import { ethers } from "ethers";

const ICO = ({ signer, accountAddress }) => {
  const [totalSupply, setTotalSupply] = useState(0);
  const [available, setAvailable] = useState(0);
  const [balance, setBalance] = useState(0)
  const [approved, setApproval] = useState(false);
  const [isInvested, setIsInvested] = useState(false);
  const inputRef = useRef();
  const NCMTContract = new ethers.Contract(
    "0x8D46fc4459df2900326E836349C6f0b08C738F2C",
    MyTokenABI,
    signer
  );
  const MTKContract = new ethers.Contract(
    "0xB8a351e37744e9687f0589E1C6504785F95a9739",
    MTK_Token,
    signer
  );
  const MTK_ICOContract = new ethers.Contract(
    "0x19D0A66dF4deeDEc824F4e2FC70c2dfeE906689f",
    MTK_ICO,
    signer
  );

  useEffect(() => {
    if (accountAddress) {
      async function checkApprove() {
        const checkApproval = await NCMTContract.allowance(
          accountAddress,
          MTK_ICOContract.address
        );
        if (ethers.utils.formatUnits(checkApproval, 18) > 0) {
          setApproval(true);
          setIsInvested(false);
        } else {
          setApproval(false);
        }
      }
      checkApprove();

    }
    readData();
  }, [accountAddress]);

  async function readData() {
    try {
      const supply = ethers.utils.formatUnits(await MTK_ICOContract.hardcap(),18);
      setTotalSupply(supply);

      const tokenAmount = ethers.utils.formatUnits(await MTK_ICOContract.tokenAmount(),18)
      const availableAmount = supply - tokenAmount;
      setAvailable(availableAmount)

      if (accountAddress) {
        const investStatus = await MTK_ICOContract.invested(
          `${accountAddress}`
        );
        setIsInvested(investStatus);
        getBalance();
      }
    } catch (error) {
      setBalance(0);
    }
  }

  async function getBalance(){
    const balance = await MTKContract.balanceOf(`${accountAddress}`);
    setBalance(ethers.utils.formatUnits(balance,18))
  }

  async function invest(amount) {
    await MTK_ICOContract.investTokens(ethers.utils.parseUnits(`${amount}`, 18));
    MTK_ICOContract.on("Purchased", (sender, amount, tokens, event) => {
      readData();
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    invest(inputRef.current.value);
  };

  async function claim() {
    await MTK_ICOContract.claimTokens();
    MTK_ICOContract.on("Claimed", (from, amount, event) => {
      setIsInvested(false);
      readData();
    });
  }

  const handleClaim = () => {
    claim();
  };

  const handleApprove = async () => {
    if (accountAddress) {
      await NCMTContract.approve(
        MTK_ICOContract.address,
        ethers.utils.parseUnits("1000000000000000000", 18)
      );
      NCMTContract.on("Approval", (spender, amount, event) => {
        if (amount > 0) {
          setApproval(true);
        }
      });
    } else {
      console.log("Please connect Metamask Wallet!");
    }
  };
  return (
    <ICOPane>
      <div className="staking-info">
        <div className="balance">
          <span className="balance-title">Total Supply:</span>
          <span className="balance-value">{totalSupply} MTK</span>
        </div>
        <div className="balance">
          <span className="balance-title">Available For Sale:</span>
          <span className="balance-value">{available} MTK</span>
        </div>
        <div className="balance">
          <span className="balance-title">Price:</span>
          <span className="balance-value">0.003 NCMT</span>
        </div>
        <div className="balance">
          <span className="balance-title">Balance:</span>
          <span className="balance-value">{balance} MTK</span>
        </div>
      </div>
      <FormICO onSubmit={handleSubmit} className="form-stake">
        <div className="label">
          <label>Quantity</label>
        </div>
        <div className="input-group">
          <input
            ref={inputRef}
            type="number"
            min="0"
            name="numberTokens"
            required
            placeholder="0"
          />
        </div>
        {accountAddress === null || (accountAddress != null && !approved) ? (
          <div className="approve-btn" onClick={handleApprove}>
            Approve Tokens
          </div>
        ) : (
          <React.Fragment>
            <InvestBtn staked={isInvested} type="submit">
              Invest
            </InvestBtn>
            <ClaimBtn staked={isInvested} onClick={handleClaim}>
              Claim
            </ClaimBtn>
          </React.Fragment>
        )}
      </FormICO>
    </ICOPane>
  );
};
const ICOPane = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  width: 700px;
  .staking-info {
    display: flex;
    align-items: center;
    justify-content: center;
    .balance {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      .balance-title {
        font-size: 18px;
        font-weight: 500;
        text-transform: capitalize;
      }
      .balance-value {
        color: #006600;
      }
    }
  }
`;
const FormICO = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 20px;
  padding: 50px;
  .label {
    align-self: flex-start;
    font-size: 18px;
    font-weight: 500;
  }
  .input-group {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 30px;
    input {
      width: 100%;
      height: 100%;
      outline: none;
      border: 1px solid #ccc;
      padding: 0 15px;
      border-radius: 2px;
    }
  }
  .approve-btn {
    font-size: 18px;
    text-transform: uppercase;
    width: 50%;
    height: 40px;
    margin-top: 20px;
    cursor: pointer;
    outline: none;
    border: none;
    background-color: #ffcc00;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      filter: brightness(1.1);
      transition: 0.3s;
    }
  }
`;

const InvestBtn = styled.button`
  text-transform: uppercase;
  width: 50%;
  height: 40px;
  margin-top: 20px;
  cursor: pointer;
  pointer-events: ${(props) => (props.staked ? `none` : `visible`)};
  opacity: ${(props) => (props.staked ? 0.5 : 1)};
  outline: none;
  border: none;
  background-color: #ffcc00;
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
  &:hover {
    filter: brightness(1.1);
    transition: 0.3s;
  }
`;

const ClaimBtn = styled.div`
  font-size: 18px;
  text-transform: uppercase;
  width: 50%;
  height: 40px;
  margin-top: 20px;
  pointer-events: ${(props) => (props.staked ? `visible` : `none`)};
  opacity: ${(props) => (props.staked ? 1 : 0.5)};
  cursor: pointer;
  outline: none;
  border: none;
  background-color: #ffcc00;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    filter: brightness(1.1);
    transition: 0.3s;
  }
`;

export default ICO;
