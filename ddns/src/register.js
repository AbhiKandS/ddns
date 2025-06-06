import DDNSArtifact from '../artifacts/contracts/DDNS.sol/DDNS.json';
import Addresses from '../ignition/deployments/chain-1337/deployed_addresses.json'
import { Web3 } from 'web3';

let web3;
let acccounts = [];
let contract;

async function connectWallet() {
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
    if (acccounts.length === 0) {
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

async function resolve(contract, domain) {
    try {
        return await contract.methods.resolve(domain).call();
    } catch (e) {
        console.log(e.data?.message || e.message);
    }
}

async function registerDomain(contract, domain, ip, resultBox) {
    try {
        await contract.methods.registerDomain(domain, ip)
            .send({
                from: web3.eth.defaultAccount,
                gas: 800000n,
                gasPrice: '10000000000',
            });
        resultBox.innerHTML = `<p><span>✅</span>Allocated Domain</p> `;
        resultBox.innerHTML = "Allocated Domain";
    } catch (e) {
        if (e?.message.includes('denied transaction'))
            resultBox.innerHTML = `<p><span>❌</span>User Denied</p> `;
        else
            resultBox.innerHTML = `<p><span>❌</span>Domain Taken</p> `;
            
        for (const key in e) {
            console.log(key, '->', e[key]);
        }
    }

    console.log('call: ', await contract.methods.resolve('bull.com').call());
}

await connectWallet();
let para = document.querySelector('#mypara');
para.innerHTML = para.innerHTML + `
            <section class="domain-section" id='result-box'>
            </section>
        `;
let resultBox = document.querySelector('#result-box');
let registerButton = document.querySelector('#register')
// await registerDomain(contract, 'bruh', '123', resultBox);


registerButton.addEventListener(
    'click',
    async () => {
        let domain = document.querySelector('#domain-input').value;
        let ip = document.querySelector('#ip-input').value;

        await registerDomain(contract, domain, ip, resultBox)
    }
);