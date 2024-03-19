import React from 'react'

const ConnectMsg = (props) => {
  return (
    <div>
        {!props.connectedAccount && <div 
            className="connect-wallet-msg">You are not connected to web3. Please 
                <button className='connect-wallet-msg-btn'
                    onClick={props.openWeb3Modal}> Connect your Wallet</button> to mint.
        </div>}
    </div>
  )
}

export default ConnectMsg