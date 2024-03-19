
const Mint = (props) => {
  
  return (
    <div className="mint">
      <div className="mint-content">
        <p>LITW MINT</p>
        {!props.connectedAccount && <button onClick={props.openWeb3Modal} className="mobile-connect-wallet-btn"> Connect Wallet</button>}
        <p>Total Supply: {props.totalSupply}/3333</p>
        <button className="minus-button" onClick={props.decreament}>
          -
        </button>{" "}
        <span className="num-mints">{props.amountMinting}</span>{" "}
        <button className="plus-button" onClick={props.increament}>
          +
        </button>
        {props.connectedAccount && props.saleStatus === "OG Mint"?<button className="mint-btn" onClick={props.ogMint}>
          Mint OG
        </button>: <p></p>}
        {props.connectedAccount && props.saleStatus === "Whitelist Mint"?<button className="mint-btn" onClick={props.whiteListMint}>
          Mint WL
        </button>: <p></p>}
        {props.connectedAccount && props.saleStatus === "Publist Mint"?<button className="mint-btn" onClick={props.pubListMint}>
          Mint PubList
        </button>: <p></p>}
        {props.connectedAccount && props.saleStatus === "Public Mint"?<button className="mint-btn" onClick={props.publicMint}>
          Mint Public
        </button>: <p></p>}
        {props.saleStatus === "Public Mint"? <p></p>: <p>WhiteList Status: {props.whiteListStatus}</p>}
        <p>Max Allowed Mints: {props.maxAllowedMints}</p>
        <p>Sale Status: {props.saleStatus}</p>
        {props.error &&  <p>{props.error}</p>}
        {props.mintMsg && <p>Error: Not WhiteListed as {props.mintMsg}</p>}
      </div>

      <div>
      {props.connectedAccount && (
              <div className="mobile-accont-info">
                <p className="conn-wallet">
                  Connected Wallet:{" ..."}
                  {props.connectedAccount &&
                    props.connectedAccount.substring(36)}
                </p>
                <p className="eth-balance">Eth Bal: {props.balance && props.balance.substring(0, 6)}</p>
                <button onClick={props.disconnect} className="disconnect-wallet">Disconnect</button>
              </div>
            )}
      </div>
    </div>
  );
};

export default Mint;
