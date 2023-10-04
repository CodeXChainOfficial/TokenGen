import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    tronWeb?: any; // Replace 'any' with the appropriate type if known
    tronLink?: any;
  }
}

function TokenDeploymentForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState<number>(0); // Set the initial value as a number
  const [decimals, setDecimals] = useState<number>(0); // Set the initial value as a number

  const [tronWeb, setTronWeb] = useState(null);
  const [address, setAddress] = useState(undefined);

  const initializeTronWeb = async () => {
    try {
      let tronWeb;
      console.log(window.tronLink);
      
      if (window.tronLink.ready) {
        tronWeb = window.tronLink.tronWeb;
      } else {
        const res = await window.tronLink.request({
          method: "tron_requestAccounts",
        });
        if (res.code === 200) {
          tronWeb = window.tronLink.tronWeb;
        }
      }

      setTronWeb(tronWeb);
      setAddress(tronWeb.defaultAddress.base58);
    } catch (error) {
      console.error("Error initializing TronWeb:", error);
    }
  };

  const handleInitializeTronWeb = () => {
    initializeTronWeb();
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      console.log(tronWeb.contract());
      const options = {
        feeLimit: 1000000000, //The maximum TRX burns for resource consumption（1TRX = 1,000,000SUN）
        callValue: 0, //The TRX transfer to the contract for each call（1TRX = 1,000,000SUN）
        tokenId: "", //The id of trc10 token transfer to the contract (Optional)
        tokenValue: 0, //The amount of trc10 token transfer to the contract for each call (Optional)
        userFeePercentage: 10, //Consume user's resource percentage. It should be an integer between [0, 100]. if 0, means it does not consume user's resource until the developer's resource has been used up
        originEnergyLimit: 10, //The maximum resource consumption of the creator in one execution or creation
        abi, //Abi string
        bytecode, //Bytecode, default hexString
        parameters: [name, symbol, supply, decimals], //The list of the parameters of the constructor, It should be converted hexString after encoded according to ABI encoder. If constructor has no parameter, this can be optional
        name: "Foo", //Contract name string
        permissionId: 1, //Optional, for multi-signature use
      };
      const tradeobj = await tronWeb.transactionBuilder.createSmartContract(options, address);
      const signedtxn = await tronWeb.trx.sign(tradeobj);
      const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);

      console.log(receipt)
    } catch (error) {
      console.log("error ", JSON.stringify(error));

      alert(`Error deploying token: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleInitializeTronWeb}>
        {address ?? "Initialize TronWeb"}
      </button>

      <h1>TRC20 Token Deployment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Symbol:</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Total Supply:</label>
          <input
            type="number"
            value={supply}
            onChange={(e) => setSupply(Number(e.target.value))} // Convert input to a number
            required
          />
        </div>
        <div>
          <label>Decimals:</label>
          <input
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value))} // Convert input to a number
            required
          />
        </div>
        <button type="submit">Deploy Token</button>
      </form>
    </div>
  );
}

export default TokenDeploymentForm;


let abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_initialSupply",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_decimals",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
let bytecode =
  "60406080815234620004245762000d6b803803806200001e8162000429565b9283398101608082820312620004245781516001600160401b03908181116200042457826200004f9185016200044f565b90602092838501519082821162000424576200006d9186016200044f565b916060868601519501519060ff82168092036200042457805192808411620003245760038054946001938487811c9716801562000419575b8988101462000403578190601f97888111620003ad575b50899088831160011462000346576000926200033a575b505060001982841b1c191690841b1781555b8551918211620003245760049586548481811c9116801562000319575b898210146200030457868111620002b9575b5087908684116001146200024e5793839491849260009562000242575b50501b92600019911b1c19161783555b604d81116200022d57600a0a9384810294818604149015171562000218573315620001d9575060025490838201809211620001c457506000917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9160025533835282815284832084815401905584519384523393a3516108a99081620004c28239f35b601190634e487b7160e01b6000525260246000fd5b60649285519262461bcd60e51b845283015260248201527f45524332303a206d696e7420746f20746865207a65726f2061646472657373006044820152fd5b601182634e487b7160e01b6000525260246000fd5b601183634e487b7160e01b6000525260246000fd5b01519350388062000131565b9190601f1984169288600052848a6000209460005b8c89838310620002a1575050501062000286575b50505050811b01835562000141565b01519060f884600019921b161c191690553880808062000277565b86860151895590970196948501948893500162000263565b87600052886000208780860160051c8201928b8710620002fa575b0160051c019085905b828110620002ed57505062000114565b60008155018590620002dd565b92508192620002d4565b602288634e487b7160e01b6000525260246000fd5b90607f169062000102565b634e487b7160e01b600052604160045260246000fd5b015190503880620000d3565b90869350601f19831691856000528b6000209260005b8d8282106200039657505084116200037d575b505050811b018155620000e5565b015160001983861b60f8161c191690553880806200036f565b8385015186558a979095019493840193016200035c565b90915083600052896000208880850160051c8201928c8610620003f9575b918891869594930160051c01915b828110620003e9575050620000bc565b60008155859450889101620003d9565b92508192620003cb565b634e487b7160e01b600052602260045260246000fd5b96607f1696620000a5565b600080fd5b6040519190601f01601f191682016001600160401b038111838210176200032457604052565b919080601f84011215620004245782516001600160401b038111620003245760209062000485601f8201601f1916830162000429565b92818452828287010111620004245760005b818110620004ad57508260009394955001015290565b85810183015184820184015282016200049756fe608060408181526004918236101561001657600080fd5b600092833560e01c91826306fdde03146104ad57508163095ea7b31461048357816318160ddd1461046457816323b872dd1461039a578163313ce5671461037e578163395093511461031757816370a08231146102e057816395d89b41146101c1578163a457c2d71461011957508063a9059cbb146100e95763dd62ed3e1461009e57600080fd5b346100e557806003193601126100e557806020926100ba6105d2565b6100c26105ed565b6001600160a01b0391821683526001865283832091168252845220549051908152f35b5080fd5b50346100e557806003193601126100e5576020906101126101086105d2565b6024359033610603565b5160018152f35b905082346101be57826003193601126101be576101346105d2565b918360243592338152600160205281812060018060a01b038616825260205220549082821061016d576020856101128585038733610771565b608490602086519162461bcd60e51b8352820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b6064820152fd5b80fd5b8383346100e557816003193601126100e557805190828454600181811c908083169283156102d6575b60209384841081146102c3578388529081156102a75750600114610252575b505050829003601f01601f191682019267ffffffffffffffff84118385101761023f575082918261023b925282610589565b0390f35b634e487b7160e01b815260418552602490fd5b8787529192508591837f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b5b8385106102935750505050830101858080610209565b80548886018301529301928490820161027d565b60ff1916878501525050151560051b8401019050858080610209565b634e487b7160e01b895260228a52602489fd5b91607f16916101ea565b5050346100e55760203660031901126100e55760209181906001600160a01b036103086105d2565b16815280845220549051908152f35b8284346101be57816003193601126101be576103316105d2565b338252600160209081528383206001600160a01b038316845290528282205460243581019290831061036b57602084610112858533610771565b634e487b7160e01b815260118552602490fd5b5050346100e557816003193601126100e5576020905160128152f35b839150346100e55760603660031901126100e5576103b66105d2565b6103be6105ed565b91846044359460018060a01b0384168152600160205281812033825260205220549060001982036103f8575b602086610112878787610603565b84821061042157509183916104166020969561011295033383610771565b9193948193506103ea565b606490602087519162461bcd60e51b8352820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152fd5b5050346100e557816003193601126100e5576020906002549051908152f35b5050346100e557806003193601126100e5576020906101126104a36105d2565b6024359033610771565b8490843461058557826003193601126105855782600354600181811c9080831692831561057b575b60209384841081146102c3578388529081156102a7575060011461052557505050829003601f01601f191682019267ffffffffffffffff84118385101761023f575082918261023b925282610589565b600387529192508591837fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b5b8385106105675750505050830101858080610209565b805488860183015293019284908201610551565b91607f16916104d5565b8280fd5b6020808252825181830181905290939260005b8281106105be57505060409293506000838284010152601f8019910116010190565b81810186015184820160400152850161059c565b600435906001600160a01b03821682036105e857565b600080fd5b602435906001600160a01b03821682036105e857565b6001600160a01b0390811691821561071e57169182156106cd5760008281528060205260408120549180831061067957604082827fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef958760209652828652038282205586815220818154019055604051908152a3565b60405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608490fd5b60405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608490fd5b60405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608490fd5b6001600160a01b0390811691821561082257169182156107d25760207f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925918360005260018252604060002085600052825280604060002055604051908152a3565b60405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608490fd5b60405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608490fdfea2646970667358221220db2c1bf3cdbac301d3289334cb78d785b7ffc8a1a9d26dc0e90e20bef2f21f2564736f6c63430008120033";
