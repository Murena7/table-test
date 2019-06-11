let data = [];
const count = 200;
const names = require('../constants/names');

module.exports.getDataArray = () => {
    return data;
}

function genData() {
    data = [];
    for (let index = 0; index < count; index++) {
        let tData = {
            campaign: names.CAMPAIGNS[Math.floor(Math.random()*names.CAMPAIGNS.length)],
            buyers: names.BUYERS[Math.floor(Math.random()*names.BUYERS.length)],
            date: randomDate(new Date(2019, 5, 8), new Date()),
            leads: +(Math.random() * 20).toFixed(0),
            revenueLeads: +(Math.random() * 100).toFixed(2),
            revenueCalls: +(Math.random() * 100).toFixed(2),
        }
        data.push(tData);
    }
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

genData();

setInterval(() => {
    genData();
}, 10000);