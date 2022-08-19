import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MyTokenABI from "../contracts/MyToken.json";
import StakeNCMT from "../contracts/StakeNCMT.json";
import { ethers } from "ethers";

const StakeRewardNCM = ({ signer, accountAddress }) => {
  const [stakeBalance, setStakeBalance] = useState(0);
  const [rewardBalance, setrewardBalance] = useState(0);
  const [approved, setApproval] = useState(false);
  const [isStaked, setIsStaked] = useState(false);
  const [isUnStaked, setIsUnStaked] = useState(true);
  const inputRef = useRef();
  const NCMTContract = new ethers.Contract(
    "0x8D46fc4459df2900326E836349C6f0b08C738F2C",
    MyTokenABI,
    signer
  );
  const StakeNCMTContract = new ethers.Contract(
    "0xAe2F84351aB1dd6305065C03EbC3AAAACFd115FC",
    StakeNCMT,
    signer
  );

  useEffect(() => {
    if (accountAddress) {
      async function checkApprove() {
        const checkApproval = await NCMTContract.allowance(
          accountAddress,
          StakeNCMTContract.address
        );
        if (ethers.utils.formatUnits(checkApproval, 18) > 0) {
          setApproval(true);
        } else {
          setApproval(false);
        }
      }
      checkApprove();

      readData();
    }
  }, [accountAddress]);

  async function readData() {
    const stakingBalance = await StakeNCMTContract.stakingBalance(
      `${accountAddress}`
    );
    setStakeBalance(ethers.utils.formatUnits(stakingBalance, 18));
    const rewardsBalance = await StakeNCMTContract.rewardCalculate();
    setrewardBalance(ethers.utils.formatUnits(rewardsBalance, 18));

    const stakeStatus = await StakeNCMTContract.addressStaked(
      `${accountAddress}`
    );
    setIsStaked(stakeStatus);
    setIsUnStaked(!stakeStatus);
  }

  async function stakeTokens(amount) {
    await StakeNCMTContract.stakeToken(
      ethers.utils.parseUnits(`${amount}`, 18)
    );
    StakeNCMTContract.on("Staked", (from, amount, event) => {
      readData();
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    stakeTokens(inputRef.current.value);
  };

  async function unStake() {
    await StakeNCMTContract.claimReward();
    StakeNCMTContract.on("Claimed", (from, amount, event) => {
      setStakeBalance(0);
      setrewardBalance(0);
      setIsUnStaked(true);
      setIsStaked(false);
    });
  }

  const handleUnstake = () => {
    unStake();
  };

  const handleApprove = async () => {
    await NCMTContract.approve(
      StakeNCMTContract.address,
      ethers.utils.parseUnits("1000000000000000000", 18)
    );
    NCMTContract.on("Approval", (spender, amount, event) => {
      if (amount > 0) {
        setApproval(true);
      }
    });
  };

  return (
    <Container>
      <StakingPane>
        <div className="staking-info">
          <div className="balance">
            <span className="balance-title">Staking Balance:</span>
            <span className="balance-value">{stakeBalance} NCMT</span>
          </div>
          <div className="balance">
            <span className="balance-title">Reward Balance:</span>
            <span className="balance-value">{rewardBalance} NCMT</span>
          </div>
        </div>
        <FormStake onSubmit={handleSubmit} className="form-stake">
          <div className="label">
            <label>Stake Tokens</label>
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
          {!approved ? (
            <div className="approve-btn" onClick={handleApprove}>
              Approve Tokens
            </div>
          ) : (
            <React.Fragment>
              <StakeBtn staked={isStaked} type="submit">
                Stake
              </StakeBtn>
              <UnstakeBtn unstaked={isUnStaked} onClick={handleUnstake}>
                Unstake
              </UnstakeBtn>
            </React.Fragment>
          )}
        </FormStake>
      </StakingPane>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-width: 1170px;
  margin: 0 auto;
  padding: 0 15px;
`;
const StakingPane = styled.div`
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
const FormStake = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 5px;
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
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      filter: brightness(1.1);
      transition: 0.3s;
    }
  }
`;

const StakeBtn = styled.button`
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
  border-radius: 2px;
  text-align: center;
  font-size: 18px;
  &:hover {
    filter: brightness(1.1);
    transition: 0.3s;
  }
`;

const UnstakeBtn = styled.div`
  font-size: 18px;
  text-transform: uppercase;
  width: 50%;
  height: 40px;
  margin-top: 20px;
  pointer-events: ${(props) => (props.unstaked ? `none` : `visible`)};
  opacity: ${(props) => (props.unstaked ? 0.5 : 1)};
  cursor: pointer;
  outline: none;
  border: none;
  background-color: #ffcc00;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    filter: brightness(1.1);
    transition: 0.3s;
  }
`;

export default StakeRewardNCM;
