import { MediaRenderer, useAddress, useContract, useOwnedNFTs, useTokenBalance } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { TOKEN_CONTRACT_ADDRESS, WORKER_CONTRACT_ADDRESS } from "../constants/contracts";

const Worker = () => {
  // Get the user's address to get the owned workers
  const address = useAddress();

  // Get the worker contract instance
  // Get the user's owned worker NFTs
  const { contract: workerContract } = useContract(WORKER_CONTRACT_ADDRESS);
  const { data: ownedWorkers, isLoading: loadingWorker } = useOwnedNFTs(workerContract, address);

  // Get the token contract instance
  // Get the user's token balance with address
  const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);

  // Truncate the number to 6 decimal places
  const truncateNumber = (num: string) => {
    return num.slice(0, 6);
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      {!loadingWorker ? (
        ownedWorkers && ownedWorkers.length > 0 ? (
          ownedWorkers.map((worker) => (
            <div
              className={styles.workerContainer}
              key={worker.metadata.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "10px",
              }}
            >
              <h2 style={{ textAlign: "center" }}>Worker Stats:</h2>
              <MediaRenderer
                key={worker.metadata.id}
                src={worker.metadata.image}
                style={{ borderRadius: "10px", margin: "10px 0px", width: "100%", maxWidth: "200px" }}
              />
              <p style={{ fontWeight: "bold", textAlign: "center" }}>
                {worker.metadata.name} - ID: #{worker.metadata.id}
              </p>
              {tokenBalance && (
                <p style={{ textAlign: "center" }}>
                  Balance: {truncateNumber(tokenBalance?.displayValue as string)} {tokenBalance?.symbol}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No workers found.</p>
        )
      ) : (
        <p>Loading worker...</p>
      )}
    </div>
  );
};

export default Worker;
