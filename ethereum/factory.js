import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xC66d0e9666E61fF89A8eBD7f2CeF92E63195dEC7"
);

export default instance;