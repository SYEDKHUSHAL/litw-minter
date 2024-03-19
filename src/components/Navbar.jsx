import React from "react";
import logo from "../logos/logo.png";

const Navbar = (props) => {
  return (
    <div>
      <nav className="navbar-wrapper">
        <ul className="nav-items">
          <li>
            <a className="logo" href="">
              <h3>LITW</h3>
              <img src={logo} />
            </a>
          </li>
          <li className="nav-links-wrapper">
            <ul className="nav-links">
              <li>
                <a href="https://litw.io/creators">Team</a>
              </li>
              <li>
                <a href="https://litw.io/media">Social</a>
              </li>
              <li>
                <a href="https://litw.io/about">About</a>
              </li>
            </ul>
          </li>
          <li>
            {props.connectedAccount ? (
              <div className="account-info">
                <p className="conn-wallet">
                  Connected:{" ..."}
                  {props.connectedAccount &&
                    props.connectedAccount.substring(36)}
                </p>
                <p className="eth-balance">Eth Bal: {props.balance && props.balance.substring(0, 6)}</p>
                <button onClick={props.disconnect} className="disconnect-wallet">Disconnect</button>
              </div>
            ) : (
              <button onClick={props.openWeb3Modal} className="nav-connect-wallet-btn">Connect Wallet</button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
