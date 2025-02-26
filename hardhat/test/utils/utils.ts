const { ethers } = require('ethers');


function Enum(...options: any[]) {
    return Object.fromEntries(options.map((key, i) => [key,  ethers.toBigInt(i)]));
  }

  export default Enum;