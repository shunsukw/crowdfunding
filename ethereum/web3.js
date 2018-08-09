import Web3 from 'web3';

let web3;

if (typeof window !== "undefined" && window.web3 !== "undefined") {
    // we are in the browser and metamusk is running.
    web3 = new Web3(window.web3.currentProvider);
} else {
    // we are on the server or user is not running metamusk
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/H2IVjg3hvfD4ZxkxfpZB"
    );
    web3 = new Web3(provider);
}

export default web3;
