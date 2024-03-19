import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Mint from "./components/Mint";
import ConnectMsg from "./components/ConnectMsg.jsx";
import { ethers } from "ethers";
import { contractAddress, abi } from "./blockchain/contractInfo.js";
import { whiteListInfoOG, whiteListInfoWL, whiteListInfoPL } from "./blockchain/whiteListinfo.js";
import { useEffect, useState } from "react";

// web3 modal imports 
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import { useWeb3Modal, useDisconnect, useWeb3ModalAccount, useWeb3ModalProvider  } from '@web3modal/ethers/react'


//RPC connection
const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
const litwContract = new ethers.Contract(contractAddress, abi, provider)

//create web3 modal 

const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID

// 2. Set chains
const sepolia = {
  chainId: 11155111, 
  name: "Sepolia test network", 
  currency: "SepoliaETH",
  explorerUrl: "https://sepolia.etherscan.io", 
  rpcUrl: process.env.REACT_APP_RPC_URL
}

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: process.env.REACT_APP_RPC_URL
}

// 3. Create a metadata object
const metadata = {
  name: 'LITW Mint',
  description: 'Lean Into The Wind Mint',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
const response = createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  // enableAnalytics: true // Optional - defaults to your Cloud configuration
})

function App() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [amountMinting, setAmountMinting] = useState(1);
  const [maxAllowedMints, setMaxAllowedMints] = useState(1);
  const [whiteListStatus, setWhiteListStatus] = useState("Loading...");
  const [saleStatus, setSaleStatus] = useState("Loading...");
  const [mintMsg, setMintMsg] = useState(null);
  const [error, setError] = useState(null);
  //web3 modal
  const { open } = useWeb3Modal()
  const { address } = useWeb3ModalAccount()
  const {disconnect} = useDisconnect();
  const { walletProvider } = useWeb3ModalProvider()

  useEffect(() => {
    console.log("rerended befoore connected account");
    setConnectedAccount(address);
    if (connectedAccount) {
      getEthBalance();
      getTotalSupply();
      getWhiteListStatus();
      getSaleStatus();
      console.log("rerended");
      console.log(connectedAccount);
      console.log("rerended");
    }
  }, [address, balance, totalSupply, saleStatus, connectedAccount]);


  const openWeb3Modal = () => {
    open()
  }

  const getEthBalance = async () => {
    const balance = await provider.getBalance(connectedAccount);
    const balanceInEther = ethers.formatEther(balance);
    setBalance(balanceInEther);
  };

  const getTotalSupply = async () => {
    let supply = await litwContract.totalSupply();
    supply = parseInt(supply)
    setTotalSupply(supply);
  };

  const increament = () => {
    if (amountMinting < maxAllowedMints) {
      setAmountMinting(amountMinting + 1);
    }
  };
  const decreament = () => {
    if (amountMinting > 1) {
      setAmountMinting(amountMinting - 1);
    }
  };

  const getSaleStatus = async () => {
    let status = await litwContract.saleStatus();
    status = parseInt(status);
    switch(status){
      case 0:
        setSaleStatus("Inactive");
        break;
      case 1:
        setSaleStatus("OG Mint");
        break;
      case 2:
        setSaleStatus("Whitelist Mint");
        break;
      case 3:
         setSaleStatus("Publist Mint");
        break;
      case 4:
        setSaleStatus("Public Mint");
        break;
      default:
        setSaleStatus("Inactive");
        break;
    }
    if (status === 1) {
      setMaxAllowedMints(2);
    } else {
      setMaxAllowedMints(1);
    }
  };

  const getWhiteListStatus = () => {
    if (whiteListInfoOG.hasOwnProperty(connectedAccount)) {
      setWhiteListStatus("Whitelisted OG");
    }
    else if (whiteListInfoWL.hasOwnProperty(connectedAccount)) {
      setWhiteListStatus("Whitelisted WL");
    }
    else if (whiteListInfoPL.hasOwnProperty(connectedAccount)) {
      setWhiteListStatus("Whitelisted PL");
    }
    else {
      setWhiteListStatus("Not Whitelisted");
    }
  };

  const ogMint = async () => {
    if (whiteListStatus === "Whitelisted OG") {
      let signer;
      let litwContractWithSigner;
      const proof = whiteListInfoOG[connectedAccount].hexProof;
      try{
        const provider = new ethers.BrowserProvider(walletProvider);

        signer = await provider.getSigner()
        litwContractWithSigner = litwContract.connect(signer);
        const tx = await litwContractWithSigner.ogMint(proof, amountMinting, {
          gasLimit: 800000,
        })
        await tx.wait();
        }catch(e){
          console.log(`Err Code: ${e.code}`);
          setError("Error!")
        }
    } else {
      console.log("Not Whitelisted OG");
      setMintMsg("OG");
    }
  };

  const whiteListMint = async () => {
    if (whiteListStatus === "Whitelisted WL") {
      let signer;
      let litwContractWithSigner;
      const proof = whiteListInfoWL[connectedAccount].hexProof;
      try{
        const provider = new ethers.BrowserProvider(walletProvider);

        signer = await provider.getSigner()
        litwContractWithSigner = litwContract.connect(signer);
        const tx = await litwContractWithSigner.whiteListMint(proof, amountMinting, {
          gasLimit: 800000,
        })
        await tx.wait();
        }catch(e){
          console.log(`Err Code: ${e.code}`);
          setError("Error!")
        }
    } else {
      console.log("Not Whitelisted WL");
      setMintMsg("WL");
    }
  };

  const pubListMint = async () => {
    if (whiteListStatus === "Whitelisted PL") {
      let signer;
      let litwContractWithSigner;
      const proof = whiteListInfoPL[connectedAccount].hexProof;
      const value = ethers.parseEther('0.0075', 'ether');
      try{
        const provider = new ethers.BrowserProvider(walletProvider);

        signer = await provider.getSigner()
        litwContractWithSigner = litwContract.connect(signer);
        const tx = await litwContractWithSigner.pubListMint(proof, amountMinting, {
          gasLimit: 800000,
          value: value
        })
        await tx.wait();
        }catch(e){
          console.log(`Err Code: ${e.code}`);
          setError("Error!")
        }
    } else {
      console.log("Not Whitelisted PL");
      setMintMsg("PL");
    }
  };

  const publicMint = async () => {
      let signer;
      let litwContractWithSigner;
      const value = ethers.parseEther('0.0075', 'ether');
      try{
        const provider = new ethers.BrowserProvider(walletProvider);

        signer = await provider.getSigner()
        litwContractWithSigner = litwContract.connect(signer);
        const tx = await litwContractWithSigner.publicMint(amountMinting, {
          gasLimit: 800000,
          value: value
        })
        await tx.wait()
      }catch(e){
        console.log(`Err Code: ${e.code}`);
        setError("Error!")
      }
  };


  return (
    <div className="App">
      <Navbar
        connectedAccount={connectedAccount}
        openWeb3Modal={openWeb3Modal}
        balance={balance}
        disconnect = {disconnect}
      />
      <Mint
        ogMint={ogMint}
        whiteListMint={whiteListMint}
        pubListMint={pubListMint}
        publicMint={publicMint}
        totalSupply={totalSupply}
        whiteListStatus={whiteListStatus}
        maxAllowedMints={maxAllowedMints}
        amountMinting={amountMinting}
        increament={increament}
        decreament={decreament}
        mintMsg= {mintMsg}
        saleStatus = {saleStatus}
        error = {error}
        connectedAccount={connectedAccount}
        openWeb3Modal= {openWeb3Modal}
        balance={balance}
        disconnect = {disconnect}
      />
      <ConnectMsg 
        connectedAccount={connectedAccount}
        openWeb3Modal={openWeb3Modal}
      />
      <Footer />
    </div>
  );
}

export default App;
