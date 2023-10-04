import "crypto-browserify";
import TronWeb from "tronweb";

// Initialize TronWeb with a full node and a solidity node
const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  solidityNode: "https://api.trongrid.io",
});

// Your contract ABI (insert your actual ABI here)
const abi = [
  [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_spender", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ name: "success", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_from", type: "address" },
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ name: "success", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "_value", type: "uint256" }],
      name: "burn",
      outputs: [{ name: "success", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_from", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "burnFrom",
      outputs: [{ name: "success", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "success", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { name: "", type: "address" },
        { name: "", type: "address" },
      ],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: true, name: "to", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "_owner", type: "address" },
        { indexed: true, name: "_spender", type: "address" },
        { indexed: false, name: "_value", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Burn",
      type: "event",
    },
  ],
];

const INPUT_PROPS = {
  tokenSymbol: {
    typeText: "text",
    type: "text",
    placeholder: "ex. tut",
  },
  tokenSupply: {
    typeText: "text",
    type: "text",
    placeholder: "token supply",
  },
  tokenName: {
    typeText: "text",
    type: "text",
    placeholder: "6",
  },
  tokenDecimal: {
    typeText: "text",
    type: "text",
    placeholder: "6",
  },
};

// Your contract bytecode (insert your actual bytecode here)
const bytecode =
  "0x6002805460ff1916600817905561271060065560c0604052600560808190527f436f64655800000000000000000000000000000000000000000000000000000060a09081526100519160079190610113565b506040805180820190915260038082527f4344580000000000000000000000000000000000000000000000000000000000602090920191825261009691600891610113565b503480156100a357600080fd5b506002805460065460ff909116600a0a02600381905533600090815260046020526040812091909155600780546100ea936001821615610100026000190190911604610191565b506008805461010d91600191600260001961010083861615020190911604610191565b50610223565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061015457805160ff1916838001178555610181565b82800160010185558215610181579182015b82811115610181578251825591602001919060010190610166565b5061018d929150610206565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101ca5780548555610181565b8280016001018555821561018157600052602060002091601f016020900482015b828111156101815782548255916001019190600101906101eb565b61022091905b8082111561018d576000815560010161020c565b90565b610733806102326000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806342966c681161007157806342966c68146101d957806370a08231146101f657806379cc67901461021c57806395d89b4114610248578063a9059cbb14610250578063dd62ed3e1461027c576100a9565b806306fdde03146100ae578063095ea7b31461012b57806318160ddd1461016b57806323b872dd14610185578063313ce567146101bb575b600080fd5b6100b66102aa565b6040805160208082528351818301528351919283929083019185019080838360005b838110156100f05781810151838201526020016100d8565b50505050905090810190601f16801561011d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101576004803603604081101561014157600080fd5b506001600160a01b038135169060200135610338565b604080519115158252519081900360200190f35b61017361039e565b60408051918252519081900360200190f35b6101576004803603606081101561019b57600080fd5b506001600160a01b038135811691602081013590911690604001356103a4565b6101c3610413565b6040805160ff9092168252519081900360200190f35b610157600480360360208110156101ef57600080fd5b503561041c565b6101736004803603602081101561020c57600080fd5b50356001600160a01b0316610494565b6101576004803603604081101561023257600080fd5b506001600160a01b0381351690602001356104a6565b6100b6610577565b6101576004803603604081101561026657600080fd5b506001600160a01b0381351690602001356105d1565b6101736004803603604081101561029257600080fd5b506001600160a01b03813581169160200135166105e7565b6000805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156103305780601f1061030557610100808354040283529160200191610330565b820191906000526020600020905b81548152906001019060200180831161031357829003601f168201915b505050505081565b3360008181526005602090815260408083206001600160a01b038716808552908352818420869055815186815291519394909390927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925928290030190a350600192915050565b60035481565b6001600160a01b03831660009081526005602090815260408083203384529091528120548211156103d457600080fd5b6001600160a01b0384166000908152600560209081526040808320338452909152902080548390039055610409848484610604565b5060019392505050565b60025460ff1681565b3360009081526004602052604081205482111561043857600080fd5b3360008181526004602090815260409182902080548690039055600380548690039055815185815291517fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca59281900390910190a2506001919050565b60046020526000908152604090205481565b6001600160a01b0382166000908152600460205260408120548211156104cb57600080fd5b6001600160a01b03831660009081526005602090815260408083203384529091529020548211156104fb57600080fd5b6001600160a01b0383166000818152600460209081526040808320805487900390556005825280832033845282529182902080548690039055600380548690039055815185815291517fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca59281900390910190a250600192915050565b60018054604080516020600284861615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156103305780601f1061030557610100808354040283529160200191610330565b60006105de338484610604565b50600192915050565b600560209081526000928352604080842090915290825290205481565b6001600160a01b03821661061757600080fd5b6001600160a01b03831660009081526004602052604090205481111561063c57600080fd5b6001600160a01b038216600090815260046020526040902054818101101561066357600080fd5b6001600160a01b038083166000818152600460209081526040808320805495891680855282852080548981039091559486905281548801909155815187815291519390950194927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a36001600160a01b0380841660009081526004602052604080822054928716825290205401811461070157fe5b5050505056fea165627a7a72305820e1e60d783d504969b0dd03fb785306499f0949bd1c34386e8ff99f6e09d08cdf0029"; // Your BIN here

export async function contractExecute(
  tokenName: string,
  tokenSymbol: string,
  tokenSupply: string,
  tokenDecimals: string
): Promise<void> {
  try {
    // Deploy the contract
    const transaction = await tronWeb.transactionBuilder.createSmartContract({
      abi: abi, // Provide the contract ABI here
      bytecode: bytecode,
      feeLimit: 1_000_000, // Adjust fee limit as needed
      callValue: 0, // Amount to send with the contract deployment
      userFeePercentage: 100, // User fee percentage
      originEnergyLimit: 10_000_000, // Adjust energy limit as needed
    });

    // Set the contract parameters
    transaction
      .setSmartContract({
        bytecode: bytecode,
        abi: abi, // Provide the contract ABI here
      })
      .setParams([tokenName, tokenSymbol, tokenSupply, tokenDecimals]);

    // Sign the transaction
    const signedTransaction = await tronWeb.trx.sign(transaction);

    // Broadcast the transaction
    const receipt = await tronWeb.trx.sendRawTransaction(signedTransaction);

    // Contract is deployed, display information
    console.log("Contract address:", receipt.contract_address);
    console.log("Transaction hash:", receipt.txid);
  } catch (error) {
    console.error("Error:", error);
  }
}

// No need to call deployContract() here, it's called in index.tsx
