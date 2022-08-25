import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MerkleTree from "merkletreejs";
import { addresses } from "../assets/addresses";
import AirdropMAM from "../contracts/AirdropMAM.json";
import { keccak256 } from "ethers/lib/utils";

const Airdrop = ({ signer, accountAddress }) => {
  const [claimable, setClaimable] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [tree, setTree] = useState();
  const AirdropContract = new ethers.Contract(
    "0xb015479175C56EEE548fF78E8E5Ce02E07E9bF50",
    AirdropMAM,
    signer
  );
  useEffect(() => {
    const leafNode = addresses.map((i) => keccak256(i));
    const merkleTree = new MerkleTree(leafNode, keccak256, { sortPairs: true });

    setTree(merkleTree);
  }, []);

  useEffect(() => {
    async function getRewardAmount() {
      const amount = await AirdropContract.rewardAmount();
      setRewardAmount(ethers.utils.formatUnits(amount, 18));
    }
    if (accountAddress) {
      try {
        getRewardAmount();
        setClaimable(true);
        const leaf = keccak256(accountAddress);
        const proof = tree.getHexProof(leaf);
        if (
          tree.verify(
            proof,
            leaf,
            "0x93e37c20fb939ffc92a5f52c2c9fa28eae9863bc61ab433addae133320e94f10"
          )
        ) {
          checkClaimed();
        }else{
          setClaimable(false)
        }
      } catch (error) {
        setRewardAmount(0);
        setClaimable(false);
      }
    } else {
      setRewardAmount(0);
      setClaimable(false);
    }
  }, [accountAddress]);

  async function checkClaimed() {
    const claimed = await AirdropContract.claimed(accountAddress);
    setClaimable(!claimed);
  }

  async function ClaimToken() {}
  const handleClaim = async () => {
    const leaf = keccak256(accountAddress);
    const proof = tree.getHexProof(leaf);
    await AirdropContract.claimToken(proof);
    AirdropContract.on("Claimed", (sender, amount, event) => {
      setClaimable(false);
    });
  };
  return (
    <AirdropPane>
      <ClaimInfo>
        <div className="title">Claim MAM Airdrop</div>
        <div className="amount-claim">{rewardAmount} MAM</div>
      </ClaimInfo>
      <Claim>
        <div className="description">
          Happy Mid-Autumn Festival <br /> Thanks for being part of our
          community.
        </div>
        <ClaimBtn claimable={claimable} onClick={handleClaim}>
          Claim Now
        </ClaimBtn>
        <p className="notice">Only member of our community can claim the airdrop</p>
      </Claim>
    </AirdropPane>
  );
};

const AirdropPane = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;
const ClaimInfo = styled.div`
  width: 100%;
  background: #ffe000;
  background: -webkit-linear-gradient(to bottom, #ffcc00, #000);
  background: linear-gradient(to bottom, #ffcc00, #000);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  color: #fff;

  .title {
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 15px;
  }
  .amount-claim {
    color: #ffcc00;
    font-size: 30px;
    font-weight: 500;
  }
`;
const Claim = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  .description {
    margin-top: 15px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
  }
  .notice{
    color: red;
    font-size: small;
    margin-top: 20px;
  }
`;

const ClaimBtn = styled.div`
  font-size: 18px;
  margin-top: 30px;
  height: 40px;
  width: 50%;
  background-color: #ffcc00;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  pointer-events: ${(props) => (props.claimable ? `visible` : `none`)};
  opacity: ${(props) => (props.claimable ? 1 : 0.5)};
  &:hover {
    filter: brightness(1.1);
    transition: 0.3s;
  }
`;

export default Airdrop;
