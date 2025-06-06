// import './style.css'
import DDNSArtifact from '../artifacts/contracts/DDNS.sol/DDNS.json';
import Addresses from '../ignition/deployments/chain-1337/deployed_addresses.json'
import {Web3} from 'web3';

window.Web3 = Web3;
window.metamask = window.ethereum;

let web3;
let acccounts = [];
let contract;

const result = document.getElementById('result');
const registerButton = document.getElementById('registerButton');
const domainInput = document.getElementById('domainInput');

export async function connectWallet() {
  const metamask = window.ethereum;

  while (!metamask) {
    //TODO: await for metamask insstallation and give link to download
    alert('Install MetaMask \n\n!!!After installatin refresh the page');
  } 
  while (!metamask.isMetaMask) {
    alert('a Different provider detected!\nUninstall it and Install MetaMask and refresh the page')
  }

  web3 = new Web3(metamask);
  web3.handleRevert = true;

  acccounts = await web3.eth.getAccounts();
  if (acccounts.length === 0){
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    acccounts = await web3.eth.getAccounts();
  }
  web3.eth.defaultAccount = acccounts[0]

  contract = new web3.eth.Contract(
    DDNSArtifact.abi,
    Addresses['DDNS#DDNS']
  );
  contract.handleRevert = true;
  console.log('connected account: ', acccounts[0]);

  return contract;
}

export async function resolve(contract, domain) {
  try{
  return await contract.methods.resolve(domain).call();
  } catch(e) {
    console.log(e.data?.message || e.message);
  }
}

export async function getAllDomains(contract) {
  return await contract.methods.getAllDomains().call();
}

export async function register(contract, domain, ip) {
  // try {
  //   await contract.methods.registerDomain(domain, ip).send({
  //     from: web3.eth.defaultAccount,
  //     gas: 800000n,
  //     gasPrice: '10000000000',
  //   })

  //   return `registered domain: ${domain} at: ` + await resolve(contract, domain);
  // }
  // catch (error) {
  //   console.log(error.data?.message || error?.message || error);
  //   if (error.message.includes(''))
  //     return `❌ Transaction rejected`;
  //   else 
  //     return `❌ domain ${domain} already registered`;
  // }
  console.log(contract);
  console.log(domain, ip);
  
  try {
    await contract.methods.registerDomain(domain, ip)
      .send({
        from: web3.eth.defaultAccount,
        gas: 800000n,
        gasPrice: '10000000000',
      });
  } catch (e) {
    for (const key in e) {
      console.log(key, '->', e[key]);
    }
  }
}

export async function executeContract(contract) {
  console.log(contract);
  contract.handleRevert = true;
  console.log('call: ', await contract.methods.getAllDomains().call());
  let bullIP = await resolve(contract, 'bull.com');
  console.log(bullIP);

  try {
    await contract.methods.registerDomain('bill.com', '204')
      .send({
        from: web3.eth.defaultAccount,
        gas: 800000n,
        gasPrice: '10000000000',
      });
  } catch (e) {
    for (const key in e) {
      console.log(key, '->', e[key]);
    }
  }
  // .on('error', (e, receipt) => {
  //   window.blah = e;
  //   console.log(e.reason);
  // });

  console.log('call: ', await contract.methods.resolve('bull.com').call());
}

// await connectWallet();
// await executeContract(contract);


// registerButton.addEventListener(
//   'click',
//   async () => {
//     const domain = domainInput.value;
//     const ip = '204.04.206.04';

//     let response = await register(contract, domain, ip);
//     console.log(response);
//     result.innerText = response;
//   }
// );
// console.log(await register(contract, 'bili.com', '2040.04'));