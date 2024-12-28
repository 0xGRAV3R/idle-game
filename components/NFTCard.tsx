import { MediaRenderer, useAddress, useClaimConditions, useContract } from "@thirdweb-dev/react";
import { NFT, toEther } from "@thirdweb-dev/sdk";
import { BUSINESSES_CONTRACT_ADDRESS, STAKING_CONTRACT_ADDRESS } from "../constants/contracts";
import styles from "../styles/Home.module.css";
import { useState } from "react";

// Props for the NFTCard component
type Props = {
  nft: NFT;
};

export default function NFTCard({ nft }: Props) {
  // Get the user's address
  const address = useAddress();

  // Get the businesses contract instance and claim conditions
  const { contract: businessesContract } = useContract(BUSINESSES_CONTRACT_ADDRESS, "edition-drop");
  const { data: claimCondition } = useClaimConditions(businessesContract, nft.metadata.id);

  // Get the staking contract instance
  const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);

  // Calculate earnings per hour
  const calculateEarnings = (cost: number) => cost * 0.1;

  // Claim state
  const [claimState, setClaimState] = useState<"init" | "nftClaim" | "staking">("init");

  // Handle NFT claim and stake
  const handleClaim = async () => {
    if (!address) return;

    setClaimState("nftClaim");
    try {
      await businessesContract?.erc1155.claim(nft.metadata.id, 1);
      console.log("NFT claimed");

      setClaimState("staking");
      const isApproved = await businessesContract?.isApproved(address, STAKING_CONTRACT_ADDRESS);
      if (!isApproved) {
        await businessesContract?.setApprovalForAll(STAKING_CONTRACT_ADDRESS, true);
      }
      await stakingContract?.call("stake", [nft.metadata.id, 1]);
    } catch (error) {
      console.error(error);
    } finally {
      setClaimState("init");
    }
  };

  return (
    <div className={styles.nftCard}>
      <MediaRenderer src={nft.metadata.image} className={styles.nftImage} />
      <div className={styles.nftDetails}>
        <h3>{nft.metadata.name}</h3>
        {claimCondition &&
          claimCondition.length > 0 &&
          claimCondition.map((condition, index) => (
            <div key={index} className={styles.nftCondition}>
              <p>
                Cost: {toEther(condition.price)} {condition.currencyMetadata.symbol}
              </p>
              <p>
                Earns: {calculateEarnings(parseInt(toEther(condition.price)))} {condition.currencyMetadata.symbol}/hour
              </p>
            </div>
          ))}
      </div>
      <button
        className={styles.nftCardButton}
        onClick={handleClaim}
        disabled={claimState !== "init"}
      >
        {claimState === "nftClaim"
          ? "Purchasing business..."
          : claimState === "staking"
          ? "Staking business..."
          : "Buy Now"}
      </button>
    </div>
  );
}
