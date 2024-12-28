import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { STAKING_CONTRACT_ADDRESS } from "../constants/contracts";
import { BigNumber } from "ethers";
import BusinessCard from "../components/BusinessCard";

const Businesses = () => {
  // Get the user's address needed for staking info
  const address = useAddress();

  // Get the staking contract instance
  // Get the staked tokens for the user
  const { contract: stakingContact } = useContract(STAKING_CONTRACT_ADDRESS);
  const { data: stakedTokens, isLoading: loadingBusinesses } = useContractRead(stakingContact, "getStakeInfo", [
    address,
  ]);

  return (
    <div
      className={styles.businessContainer}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {!loadingBusinesses ? (
        <>
          <h2 style={{ textAlign: "center" }}>Businesses:</h2>
          <div
            className={styles.grid}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
              width: "100%",
            }}
          >
            {stakedTokens && stakedTokens[0].length > 0 ? (
              stakedTokens[0]?.map((stakedToken: BigNumber) => (
                <BusinessCard key={stakedToken.toString()} tokenId={stakedToken.toNumber()} />
              ))
            ) : (
              <p>No businesses started.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading businesses...</p>
      )}
    </div>
  );
};

export default Businesses;
