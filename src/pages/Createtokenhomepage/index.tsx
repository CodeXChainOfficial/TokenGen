import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import MyTokenContractABI from './MyToken.json';
import axios from 'axios'; // Import Axios for making HTTP requests
import { ethers } from 'ethers';
import EthereumTx from 'ethereumjs-tx';



const infuraRpcUrl = 'https://mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b';

declare global {
  interface Window {
    ethereum?: any; // Replace 'any' with the appropriate type if known
  }}

const Createtokenhomepage: React.FC = () => {


  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [decimal, setDecimal] = useState('');
  const [deploymentHash, setDeploymentHash] = useState('');
  const [deployedTokens, setDeployedTokens] = useState([]);
  const [deployedTokenCount, setDeployedTokenCount] = useState<number>(0);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const [selectedRpcUrl, setSelectedRpcUrl] = useState<string>(''); // Declare selectedRpcUrl state
  const infuraProjectId = '5f3224c8075b407fa38911977320235b'; // Replace with your actual Infura project ID


  const [selectedMainnetNetwork, setSelectedMainnetNetwork] = useState('MainNet');
  const [selectedTestnetNetwork, setSelectedTestnetNetwork] = useState('TestNet');
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null); // Declare web3 using useState
  const [chainId, setChainId] = useState<string>(''); // Add state for chainId



const networkOptions = {
      mainnet: {
        label: 'Mainnet',
        options: [
          {
            label: 'Ethereum',
            chainId: '0x1', // Ethereum Mainnet
            rpcUrl: 'https://mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Linea',
            chainId: '0xe708', // Ethereum Mainnet
            rpcUrl: 'https://linea-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Polygon',
            chainId: '0x89', // Ethereum Mainnet
            rpcUrl: 'https://polygon-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Optimism',
            chainId: '0x12c', // Ethereum Mainnet
            rpcUrl: 'https://optimism-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Arbitrum',
            chainId: '0xa4b1', // Ethereum Mainnet
            rpcUrl: 'https://arbitrum-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },

          {
            label: 'Avalanche',
            chainId: '0xa86a', // Ethereum Mainnet
            rpcUrl: 'https://avalanche-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Near',
            chainId: '0x4e454152', // Ethereum Mainnet
            rpcUrl: 'https://near-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Aurora',
            chainId: '0x4e454152', // Ethereum Mainnet
            rpcUrl: 'https://aurora-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },

          {
            label: 'Celo',
            chainId: '0xa4ec', // Ethereum Mainnet
            rpcUrl: 'https://celo-mainnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
        ],
      },
      testnet: {
        label: 'Testnet',
        options: [
          {
            label: 'Eth-Goerli',
            chainId: '0x5', // Goerli Testnet

            rpcUrl: 'https://goerli.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Arthera-TestNet',
            chainId: '0x2803', // Ethereum Mainnet
            rpcUrl: 'https://rpc-test.arthera.net',
          },
          {
            label: 'Eth-Sepolia',
            chainId: '0xaa36a7', // Ethereum Mainnet
            rpcUrl: 'https://sepolia.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Poly-Mumbai',
            chainId: '0x13881', // Ethereum Mainnet
            rpcUrl: 'https://polygon-mumbai.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Opt-Goerli',
            chainId: '0x1a4', // Ethereum Mainnet
            rpcUrl: 'https://optimism-goerli.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Arb-Goerli',
            chainId: '0x6f70', // Ethereum Mainnet
            rpcUrl: 'https://arbitrum-goerli.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Avax-Fuji',
            chainId: '0xa869', // Ethereum Mainnet
            rpcUrl: 'https://avalanche-fuji.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Near-Testnet',
            chainId: '0x4e454153', // Ethereum Mainnet
            rpcUrl: 'https://near-testnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Aurora-Testnet',
            chainId: '0x4e454153', // Ethereum Mainnet
            rpcUrl: 'https://aurora-testnet.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
          {
            label: 'Celo-Alfajores',
            chainId: '0xaef3', // Ethereum Mainnet

            rpcUrl: 'https://celo-alfajores.infura.io/v3/5f3224c8075b407fa38911977320235b',
          },
        ],
      },
    };
    
    useEffect(() => {
      const web3Instance = new Web3(selectedRpcUrl);
      setWeb3(web3Instance);
    
      // Request account access
      if (window.ethereum) {

        window.ethereum
          .enable()
          .then((accounts) => {
            if (accounts.length > 0) {
              const address = accounts[0];
              setUserAddress(address);
              console.log('User Address:', address);
            } else {
              console.error('No accounts found.');
            }
          })
          .catch((error) => {
            console.error('Error fetching user address:', error);
          });
      }
    }, [selectedRpcUrl]);
  



   
  
   

  
      // Handle mainnet network change
      const handleMainnetNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSelectedMainnetNetwork = e.target.value;
        const newSelectedMainnetRpcUrl = networkOptions.mainnet.options.find(option => option.label === newSelectedMainnetNetwork)?.rpcUrl;
        const newSelectedMainnetCHainId = networkOptions.mainnet.options.find(option => option.label === newSelectedMainnetNetwork)?.chainId;
      
        setSelectedMainnetNetwork(newSelectedMainnetNetwork);
  
        if (newSelectedMainnetRpcUrl) {
          setSelectedRpcUrl(newSelectedMainnetRpcUrl);
          console.log('selectedRpcUrl:', newSelectedMainnetRpcUrl);
          console.log('selectedNetwork:', newSelectedMainnetNetwork);

          connectToNetwork(newSelectedMainnetCHainId);

        }
      };
  
      // Handle testnet network change
      const handleTestnetNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSelectedTestnetNetwork = e.target.value;
        const newSelectedTestnetRpcUrl = networkOptions.testnet.options.find(option => option.label === newSelectedTestnetNetwork)?.rpcUrl;
        setSelectedTestnetNetwork(newSelectedTestnetNetwork);

        const newSelectedTestnetchainID =networkOptions.testnet.options.find(option => option.label === newSelectedTestnetNetwork)?.chainId;
      
  
  
        if (newSelectedTestnetRpcUrl) {
          setSelectedRpcUrl(newSelectedTestnetRpcUrl);
          console.log('selectedRpcUrl:', newSelectedTestnetRpcUrl);
          console.log('selectedNetwork:', newSelectedTestnetNetwork);
          setChainId(newSelectedTestnetNetwork); // Set the chainId based on the selected network

          connectToNetwork(newSelectedTestnetchainID);

        }
      };

      const connectToNetwork = async (chainId: string) => {
        if (window.ethereum) {
          try {
            // Request to switch to the desired network
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId }] // Pass the desired chainId to switch to
            });
      
            // Network switch was successful
            console.log('Switched to the desired network.');
            
            // You can add additional logic here to handle the switched network
            // For example, you can update the user interface or perform network-specific tasks.
          } catch (error) {
            // Handle errors, e.g., user rejected the request or the network switch failed
            console.error('Error switching network:', error);
          }
        } else {
          // Ethereum provider not available (e.g., MetaMask not installed)
          console.error('Ethereum provider not available.');
        }
      };
      
    
 



  useEffect(() => {

    axios.get('http://localhost:3004/api/tokenCount')
    .then((response) => {
      if (response.status === 200) {
        setDeployedTokenCount(response.data.count);
      } else {
        console.error('Failed to fetch token count:', response.statusText);
      }
    })
    .catch((error) => {
      console.error('Error fetching token count:', error);
    });

  
  }, []);
        const contractAddress = '0xf8e81D47203A594245E36C48e151709F0C19fBe8'; // Replace with your contract address



   

     

   const MyTokenContractData = "60806040523480156200001157600080fd5b5060405162001d3e38038062001d3e83398181016040528101906200003791906200041c565b838381600390816200004a91906200070d565b5080600490816200005c91906200070d565b5050506200008f338260ff16600a62000076919062000977565b84620000839190620009c8565b6200009960201b60201c565b5050505062000aff565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036200010b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001029062000a74565b60405180910390fd5b6200011f600083836200020660201b60201c565b806002600082825462000133919062000a96565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620001e6919062000ae2565b60405180910390a362000202600083836200020b60201b60201c565b5050565b505050565b505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b62000279826200022e565b810181811067ffffffffffffffff821117156200029b576200029a6200023f565b5b80604052505050565b6000620002b062000210565b9050620002be82826200026e565b919050565b600067ffffffffffffffff821115620002e157620002e06200023f565b5b620002ec826200022e565b9050602081019050919050565b60005b8381101562000319578082015181840152602081019050620002fc565b60008484015250505050565b60006200033c6200033684620002c3565b620002a4565b9050828152602081018484840111156200035b576200035a62000229565b5b62000368848285620002f9565b509392505050565b600082601f83011262000388576200038762000224565b5b81516200039a84826020860162000325565b91505092915050565b6000819050919050565b620003b881620003a3565b8114620003c457600080fd5b50565b600081519050620003d881620003ad565b92915050565b600060ff82169050919050565b620003f681620003de565b81146200040257600080fd5b50565b6000815190506200041681620003eb565b92915050565b600080600080608085870312156200043957620004386200021a565b5b600085015167ffffffffffffffff8111156200045a57620004596200021f565b5b620004688782880162000370565b945050602085015167ffffffffffffffff8111156200048c576200048b6200021f565b5b6200049a8782880162000370565b9350506040620004ad87828801620003c7565b9250506060620004c08782880162000405565b91505092959194509250565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200051f57607f821691505b602082108103620005355762000534620004d7565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200059f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000560565b620005ab868362000560565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620005ee620005e8620005e284620003a3565b620005c3565b620003a3565b9050919050565b6000819050919050565b6200060a83620005cd565b620006226200061982620005f5565b8484546200056d565b825550505050565b600090565b620006396200062a565b62000646818484620005ff565b505050565b5b818110156200066e57620006626000826200062f565b6001810190506200064c565b5050565b601f821115620006bd5762000687816200053b565b620006928462000550565b81016020851015620006a2578190505b620006ba620006b18562000550565b8301826200064b565b50505b505050565b600082821c905092915050565b6000620006e260001984600802620006c2565b1980831691505092915050565b6000620006fd8383620006cf565b9150826002028217905092915050565b6200071882620004cc565b67ffffffffffffffff8111156200073457620007336200023f565b5b62000740825462000506565b6200074d82828562000672565b600060209050601f83116001811462000785576000841562000770578287015190505b6200077c8582620006ef565b865550620007ec565b601f19841662000795866200053b565b60005b82811015620007bf5784890151825560018201915060208501945060208101905062000798565b86831015620007df5784890151620007db601f891682620006cf565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b600185111562000882578086048111156200085a5762000859620007f4565b5b60018516156200086a5780820291505b80810290506200087a8562000823565b94506200083a565b94509492505050565b6000826200089d576001905062000970565b81620008ad576000905062000970565b8160018114620008c65760028114620008d15762000907565b600191505062000970565b60ff841115620008e657620008e5620007f4565b5b8360020a9150848211156200090057620008ff620007f4565b5b5062000970565b5060208310610133831016604e8410600b8410161715620009415782820a9050838111156200093b576200093a620007f4565b5b62000970565b62000950848484600162000830565b925090508184048111156200096a5762000969620007f4565b5b81810290505b9392505050565b60006200098482620003a3565b91506200099183620003a3565b9250620009c07fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84846200088b565b905092915050565b6000620009d582620003a3565b9150620009e283620003a3565b9250828202620009f281620003a3565b9150828204841483151762000a0c5762000a0b620007f4565b5b5092915050565b600082825260208201905092915050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b600062000a5c601f8362000a13565b915062000a698262000a24565b602082019050919050565b6000602082019050818103600083015262000a8f8162000a4d565b9050919050565b600062000aa382620003a3565b915062000ab083620003a3565b925082820190508082111562000acb5762000aca620007f4565b5b92915050565b62000adc81620003a3565b82525050565b600060208201905062000af9600083018462000ad1565b92915050565b61122f8062000b0f6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461016857806370a082311461019857806395d89b41146101c8578063a457c2d7146101e6578063a9059cbb14610216578063dd62ed3e14610246576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610276565b6040516100c39190610b0c565b60405180910390f35b6100e660048036038101906100e19190610bc7565b610308565b6040516100f39190610c22565b60405180910390f35b61010461032b565b6040516101119190610c4c565b60405180910390f35b610134600480360381019061012f9190610c67565b610335565b6040516101419190610c22565b60405180910390f35b610152610364565b60405161015f9190610cd6565b60405180910390f35b610182600480360381019061017d9190610bc7565b61036d565b60405161018f9190610c22565b60405180910390f35b6101b260048036038101906101ad9190610cf1565b6103a4565b6040516101bf9190610c4c565b60405180910390f35b6101d06103ec565b6040516101dd9190610b0c565b60405180910390f35b61020060048036038101906101fb9190610bc7565b61047e565b60405161020d9190610c22565b60405180910390f35b610230600480360381019061022b9190610bc7565b6104f5565b60405161023d9190610c22565b60405180910390f35b610260600480360381019061025b9190610d1e565b610518565b60405161026d9190610c4c565b60405180910390f35b60606003805461028590610d8d565b80601f01602080910402602001604051908101604052809291908181526020018280546102b190610d8d565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b5050505050905090565b60008061031361059f565b90506103208185856105a7565b600191505092915050565b6000600254905090565b60008061034061059f565b905061034d858285610770565b6103588585856107fc565b60019150509392505050565b60006012905090565b60008061037861059f565b905061039981858561038a8589610518565b6103949190610ded565b6105a7565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546103fb90610d8d565b80601f016020809104026020016040519081016040528092919081815260200182805461042790610d8d565b80156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b5050505050905090565b60008061048961059f565b905060006104978286610518565b9050838110156104dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d390610e93565b60405180910390fd5b6104e982868684036105a7565b60019250505092915050565b60008061050061059f565b905061050d8185856107fc565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610616576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060d90610f25565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610685576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067c90610fb7565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516107639190610c4c565b60405180910390a3505050565b600061077c8484610518565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146107f657818110156107e8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107df90611023565b60405180910390fd5b6107f584848484036105a7565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361086b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610862906110b5565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d190611147565b60405180910390fd5b6108e5838383610a72565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561096b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610962906111d9565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a599190610c4c565b60405180910390a3610a6c848484610a77565b50505050565b505050565b505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610ab6578082015181840152602081019050610a9b565b60008484015250505050565b6000601f19601f8301169050919050565b6000610ade82610a7c565b610ae88185610a87565b9350610af8818560208601610a98565b610b0181610ac2565b840191505092915050565b60006020820190508181036000830152610b268184610ad3565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610b5e82610b33565b9050919050565b610b6e81610b53565b8114610b7957600080fd5b50565b600081359050610b8b81610b65565b92915050565b6000819050919050565b610ba481610b91565b8114610baf57600080fd5b50565b600081359050610bc181610b9b565b92915050565b60008060408385031215610bde57610bdd610b2e565b5b6000610bec85828601610b7c565b9250506020610bfd85828601610bb2565b9150509250929050565b60008115159050919050565b610c1c81610c07565b82525050565b6000602082019050610c376000830184610c13565b92915050565b610c4681610b91565b82525050565b6000602082019050610c616000830184610c3d565b92915050565b600080600060608486031215610c8057610c7f610b2e565b5b6000610c8e86828701610b7c565b9350506020610c9f86828701610b7c565b9250506040610cb086828701610bb2565b9150509250925092565b600060ff82169050919050565b610cd081610cba565b82525050565b6000602082019050610ceb6000830184610cc7565b92915050565b600060208284031215610d0757610d06610b2e565b5b6000610d1584828501610b7c565b91505092915050565b60008060408385031215610d3557610d34610b2e565b5b6000610d4385828601610b7c565b9250506020610d5485828601610b7c565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610da557607f821691505b602082108103610db857610db7610d5e565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610df882610b91565b9150610e0383610b91565b9250828201905080821115610e1b57610e1a610dbe565b5b92915050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b6000610e7d602583610a87565b9150610e8882610e21565b604082019050919050565b60006020820190508181036000830152610eac81610e70565b9050919050565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000610f0f602483610a87565b9150610f1a82610eb3565b604082019050919050565b60006020820190508181036000830152610f3e81610f02565b9050919050565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b6000610fa1602283610a87565b9150610fac82610f45565b604082019050919050565b60006020820190508181036000830152610fd081610f94565b9050919050565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b600061100d601d83610a87565b915061101882610fd7565b602082019050919050565b6000602082019050818103600083015261103c81611000565b9050919050565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b600061109f602583610a87565b91506110aa82611043565b604082019050919050565b600060208201905081810360008301526110ce81611092565b9050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b6000611131602383610a87565b915061113c826110d5565b604082019050919050565b6000602082019050818103600083015261116081611124565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b60006111c3602683610a87565b91506111ce82611167565b604082019050919050565b600060208201905081810360008301526111f2816111b6565b905091905056fea26469706673582212206b07a655f515dee6bdae669dbdb86d0cc91d52b01bf264615cc96d5554473d4564736f6c63430008120033"; 

   const convertToAbiItemArray = (abi: any) => {
    if (Array.isArray(abi)) {
      return abi;
    } else if (abi && typeof abi === "object") {
      return [abi];
    }
    return [];
  };
      const abiArray = convertToAbiItemArray(MyTokenContractABI);
      console.log('abiArray2:', abiArray);

  

      const [tokenAddresses, setTokenAddresses] = useState([]);
      const [tokenInfo, setTokenInfo] = useState([]);
      
    
      useEffect(() => {

    


        // Retrieve the list of token addresses associated with your wallet
        const addresses = ['0x4eC6a5AAb9D8E6369b53c2880598106E59a78d10']; // Replace with your actual addresses
    
        // Set the list of token addresses
        setTokenAddresses(addresses);
    
       
    
        // Create instances of token contracts and fetch token information
        const fetchTokenInfo = async () => {
          const tokenInfoArray = [];
          const convertToAbiItemArray = (abi: any) => {
            if (Array.isArray(abi)) {
              return abi;
            } else if (abi && typeof abi === "object") {
              return [abi];
            }
            return [];
          };
          for (const address of addresses) {
            const abiArray = convertToAbiItemArray(MyTokenContractABI);
            const tokenContract = new web3.eth.Contract(abiArray, address);
    
            // Query token information
            const name = await tokenContract.methods.name().call();
            const symbol = await tokenContract.methods.symbol().call();
            const balance = await tokenContract.methods.balanceOf(userAddress).call();

            // Add token info to the array
            tokenInfoArray.push({ address, name, symbol, balance });
          }
    
          // Set the token information
          setTokenInfo(tokenInfoArray);
        };
    
        fetchTokenInfo();
      }, []);

  const handleCreateToken = async () => {

    setDeploymentStatus('Pending');

  
    
    
      // Rest of your code remains the same...

  
   
      if (!tokenName || !tokenSymbol || !initialSupply || !decimal) {
        console.error('Please provide valid values for tokenName, tokenSymbol, initialSupply, and decimal.');
        return;
      }


  

      
    
     

        alert(`Deploying Token:
        Name: ${tokenName}
        Symbol: ${tokenSymbol}
        Initial Supply: ${initialSupply}
        Sender Address: ${userAddress}`);
    
  
      // Replace MyTokenContractData with the bytecode of the compiled MyToken.sol contract
     

    // Explicitly specify the type of arguments as string[]
    const contractArguments: any[] = [tokenName, tokenSymbol, initialSupply, decimal];

    console.log('contractArguments:', contractArguments);

  
   
      const web3Instance = new Web3(selectedRpcUrl);
      setWeb3(web3Instance);
    
      // Request account access
      if (window.ethereum) {
        const accounts = await window.ethereum.enable();

        window.ethereum
          .enable()
          .then((accounts) => {
            if (accounts.length > 0) {
              const address = accounts[0];
              setUserAddress(address);
              console.log('User Address stage 2:', address);
            } else {
              console.error('No accounts found. (step2)');
            }
          })
          .catch((error) => {
            console.error('Error fetching user address:', error);
          });
      }
    


      console.log('Arrived');

     
        // Create the contract instance
    

          try{


  const yourTokenContract = new web3.eth.Contract(abiArray, contractAddress);
  // Now you can interact with the contract
  // Now you can interact with the contract s
  const gasPriceWei = await web3.eth.getGasPrice();
  console.log('Estimated gasPriceWei:', gasPriceWei);

 
    const gasPrice = gasPriceWei
    console.log('Gas Price (Gwei):', gasPrice);
    
    const gasLimit =  1335010
    console.log('Estimated Gas Limit:', gasLimit);

  
          // Convert nonce to hexadecimal
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const userAddress = accounts[0]; // Get the user's address
        
          console.log('accounts:', accounts);
          console.log('userAddress:', userAddress);

        
        // Prepare the transaction object
        const contract = new web3.eth.Contract(abiArray);
        console.log('contract:', contract);

  const deployData = contract.deploy({
    data: MyTokenContractData,
    arguments: contractArguments,
  }).encodeABI();
  console.log('deployData:', deployData);


        const nonce = await web3.eth.getTransactionCount(userAddress);
        const rawTx = {
          nonce: web3.utils.toHex(nonce),
          gasPrice: web3.utils.toHex(gasPrice),
          gasLimit: web3.utils.toHex(gasLimit),
          data: deployData,
          from: userAddress,
        };
        console.log('rawTx:', rawTx);

          const signedTx = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: userAddress,
              to: null, // For contract deployment, set 'to' as null
              gas: rawTx.gasLimit,
              gasPrice: rawTx.gasPrice,
              nonce: rawTx.nonce,
              data: rawTx.data,
            }],
          });
    
          console.log('Transaction Hash:', signedTx);

        // Send the transaction using MetaMask
        
        async function waitForReceipt(txHash, maxRetries = 60) {
          let retries = 0;
          while (retries < maxRetries) {
            try {
              const receipt = await web3.eth.getTransactionReceipt(txHash);
              if (receipt) {
                return receipt;
              }
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
            } catch (error) {
              console.error('Error while waiting for receipt:', error);
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
            }
            retries++;
          }
          throw new Error('Transaction not mined within the expected time.');
        }
        
        // After sending the transaction
        const receipt = await waitForReceipt(signedTx, 60); // Wait for a maximum of 60 seconds
        if (receipt && receipt.contractAddress) {
          console.log('Contract deployed at address:', receipt.contractAddress);
        } else {
          console.log('Transaction mined, but contract address not available yet.');
        }

        const newTokenInfo = {
          walletAddress: userAddress,
          tokenName: tokenName,
          tokenSymbol: tokenSymbol,
          initialSupply: initialSupply,
          decimals: decimal,
          tokenAddress: receipt.contractAddress,
          deploymentTxHash: signedTx,
        };
    
       
          setDeployedTokens([...deployedTokens, newTokenInfo]);
          console.log('deployedTokens',deployedTokens );
          console.log('newTokenInfo',newTokenInfo );
  
  
          axios.post('http://localhost:3004/api/tokens', newTokenInfo)
            .then((response) => {
              if (response.status === 201) {
                console.log('Token information saved successfully.');
              } else {
                console.error('Failed to save token information:', response.statusText);
              }
            })
            .catch((error) => {
              console.error('Error saving token information:', error);
            });


            const newCount = deployedTokenCount + 1;
  setDeployedTokenCount(newCount);

  // Update the token count on your API
  axios.post('http://localhost:3004/api/tokenCount', { count: newCount })
    .then((response) => {
      if (response.status === 201) {
        console.log('Token count updated successfully on the API.');
      } else {
        console.error('Failed to update token count:', response.statusText);
      }
    })

    const response = await axios.get(`http://localhost:3004/api/tokens/${userAddress}`);
      if (response.status === 200) {
        // Set the retrieved tokens in your component's state for display
        setDeployedTokens(response.data);
        console.log('Set Deployed Token', response.data);

      } else {
        console.error('Failed to fetch token information:', response.statusText);
      }


      const fetchDeployedTokens = async (address: string) => {
        try {
          const response = await axios.get(`http://localhost:3004/api/tokens/${address}`);
          if (response.status === 200) {
            setDeployedTokens(response.data);
          } else {
            console.error('Failed to fetch deployed tokens:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching deployed tokens:', error);
        }
      };
        
  
     
          fetchDeployedTokens(userAddress);

        
       
  } catch (error) {
    console.error('Error deploying contract:', error);
  }



 
  }



  


  return (
 
    <div>

<div>
        <label>Mainnet:</label>
        <select id="mainnetSelect" value={selectedMainnetNetwork}   onChange={handleMainnetNetworkChange}
>
          {networkOptions.mainnet.options.map((option) => (
            <option key={option.label} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Testnet:</label>
        <select id="testnetSelect" value={selectedTestnetNetwork}   onChange={handleTestnetNetworkChange}
>
          {networkOptions.testnet.options.map((option) => (
            <option key={option.label} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      </div>





            <p>Total Deployed Tokens: {deployedTokenCount}</p>
  {/* Display the deployment status */}
  <p>Deployment Status: {deploymentStatus}</p>

{/* Display transaction hash if available */}
{deploymentHash && (
  <p>Transaction Hash: {deploymentHash}</p>
)}
      <input
        type="text"
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
        placeholder="Token Name"
      />
      <input
        type="text"
        value={tokenSymbol}
        onChange={(e) => setTokenSymbol(e.target.value)}
        placeholder="Token Symbol"
      />
      <input
        type="number"
        value={initialSupply}
        onChange={(e) => setInitialSupply(e.target.value)}
        placeholder="Initial Supply"
      />

<input
        type="number"
        value={decimal}
        onChange={(e) => setDecimal(e.target.value)}
        placeholder="Initial Decimal"
      />
      <button onClick={handleCreateToken}>Create Token</button>
    

       
   <h2>Your Token Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Token Address</th>
            <th>Token Name</th>
            <th>Token Symbol</th>
            <th>Decimal</th>
            <th>Supply</th>
            <th>Deployment Hash</th>
          </tr>
        </thead>
        <tbody>
        {deployedTokens.map((token, index) => (
    <tr key={index}>
      <td>{token.tokenAddress}</td>
      <td>{token.tokenName}</td>
      <td>{token.tokenSymbol}</td>
      <td>{token.decimals}</td>
      <td>{token.initialSupply}</td>
      <td>{token.deploymentTxHash}</td>
    </tr>
  ))}
        </tbody>
      </table>
    </div>
  );
};
export default Createtokenhomepage;
