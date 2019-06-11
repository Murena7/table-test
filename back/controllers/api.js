const data = require('../utils/data-generator');
const utils = require('../utils/utils');

module.exports.campaigns = (req, res) => {
    if (req.query.name && req.query.filter) {
        res.status(200).json(utils.levelSwitcher(data.getDataArray(), 'campaign', req.query.name, req.query.filter));
    } else {
        let tData = utils.campaigns(data.getDataArray());

        res.status(200).json(tData);
        // res.status(200).json(data.getDataArray());
    }
};

module.exports.buyers = (req, res) => {
    if (req.query.name && req.query.filter) {
        res.status(200).json(utils.levelSwitcher(data.getDataArray(), 'buyers', req.query.name, req.query.filter));
    } else {
        let tData = utils.buyers(data.getDataArray());
        res.status(200).json(tData);
    }
};

module.exports.daily = (req, res) => {
    let tData = utils.daily(data.getDataArray(), new Date(2019, 5, 8), new Date());
    res.status(200).json(tData);
};

module.exports.hourly = (req, res) => {
    let tData = utils.hourly(data.getDataArray(), new Date());
    res.status(200).json(tData);
};


