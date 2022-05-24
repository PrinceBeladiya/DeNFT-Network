import React from 'react';

const BuyCrypto = () => (
  <div className="buy-crypto-container">
    <iframe
      height="100%"
      title="Transak On/Off Ramp Widget"
      src={`https://staging-global.transak.com?apiKey=`}
      frameborder="no"
      allowtransparency="true"
      allowfullscreen=""
      width="100%"
    ></iframe>
  </div>
);

export default BuyCrypto;
