const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());


const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampagin = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaginAddress;
let campagin;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: "0x" + compiledFactory.bytecode })
        .send({from: accounts[0], gas: "1000000"});
    
    await factory.methods.createCampagin("100").send({
        from: accounts[0],
        gas: "1000000"
    });

    const addresses = await factory.methods.getDeployedContract().call();
    campaginAddress = addresses[0];
    
    campagin = await new web3.eth.Contract(JSON.parse(compiledCampagin.interface), campaginAddress)
});


describe("Campagins", async () => {
    it("successfuly deployed factory and campagin", () => {
        assert.ok(factory.options.address);
        assert.ok(campagin.options.address);
    });

    it("marks caller as the campagin manager", async () => {
        const manager = await campagin.methods.manager().call();

        assert.equal(accounts[0], manager);
    })

    it("allows people to contribute and marks them as approvers", async () => {
        await campagin.methods.Contribute().send({
            value: "200",
            from: accounts[1]
        });

        const isContributer = await campagin.methods.approvers(accounts[1]).call();

        assert(isContributer);
    })

    it("requires minimum contribution", async () => {
        try {
            await campagin.methods.Contribute().send({
                value: "5",
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        };
    });

    it('allows a manager to make a payment request', async () => {
        await campagin.methods
            .createRequest('Buy batteries', 100, accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        const request = await campagin.methods.requests(0).call();

        assert.equal('Buy batteries', request.description);
    });
})