import React from "react";

import discord from "../logos/discord.gif";
import opensea from "../logos/opensea.gif";
import twitter from "../logos/twitter.gif";
const Footer = () => {
  return (
    <div>
      <footer>
        <a href="https://twitter.com/justLITW">
          <img src={twitter} />
        </a>
        <a href="https://discord.gg/litw">
          <img src={discord} />
        </a>
        <a href="">
          <img src={opensea} />
        </a>
      </footer>
    </div>
  );
};

export default Footer;
