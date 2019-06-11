const names = require('../constants/names');

function sum(key, data, fixed = 2) {
    return data.reduce((a, b) => {
        return +(parseFloat(a) + (parseFloat(b[key]) || 0)).toFixed(fixed);
    }, 0);
}

function getDaysArray(start, end) {
    for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
    }
    return arr;
};

function hourlyFilter(value, data) {
    return data.filter(arr => {
        return value
            === arr.date.getHours()
    })
}

function dailyFilter(value, data) {
    return data.filter(arr => {
        let d1 = new Date(arr.date.getFullYear(), arr.date.getMonth(), arr.date.getDate()).setHours(0, 0, 0, 0)
        let d2 = new Date(value.getFullYear(), value.getMonth(), value.getDate()).setHours(0, 0, 0, 0)
        return d1 === d2;
    })
}

function buyersFilter(value, data) {
    return data.filter(arr => arr.buyers === value);
}

function campaignsFilter(value, data) {
    return data.filter(arr => arr.campaign === value);
}

function filterTypeSwitcher(data, type, name, filterType) {
    switch (filterType) {
        case 'hourly':
            return hourly(subLevelFilter(type, name, data), new Date());
            break;

        default:
            console.log('Wrond filterTypeSwitcher');
            break;
    }
}

function levelSwitcher(data, type, name, filterType) {
    switch (type) {
        case 'campaign':
            return filterTypeSwitcher(data, type, name, filterType);
            break;
        case 'buyers':
            return filterTypeSwitcher(data, type, name, filterType);
            break;
        case 'daily':
            return filterTypeSwitcher(data, type, name, filterType);
            break;
        case 'hourly':
            return filterTypeSwitcher(data, type, name, filterType);
            break;

        default:
            console.log('Wrond Query Parameters');
            break;
    }
}

function subLevelFilter(type, value, data) {
    return data.filter(arr => arr[type] === value);
}


function campaigns(data) {
    let dataArray = names.CAMPAIGNS.map(value => {
        return {
            name: value,
            leads: sum('leads', campaignsFilter(value, data), 0),
            revenueLeads: sum('revenueLeads', campaignsFilter(value, data)),
            revenueCalls: sum('revenueCalls', campaignsFilter(value, data)),
        };
    });
    return dataArray;
}

function buyers(data) {
    let dataArray = names.BUYERS.map(value => {
        return {
            name: value,
            leads: sum('leads', buyersFilter(value, data), 0),
            revenueLeads: sum('revenueLeads', buyersFilter(value, data)),
            revenueCalls: sum('revenueCalls', buyersFilter(value, data)),
        };
    });
    return dataArray;
}

function daily(data, start, end) {
    let arrayDate = getDaysArray(start, end);
    let dataArray = arrayDate.map(value => {
        return {
            name: value,
            leads: sum('leads', dailyFilter(value, data), 0),
            revenueLeads: sum('revenueLeads', dailyFilter(value, data)),
            revenueCalls: sum('revenueCalls', dailyFilter(value, data)),
        };
    });
    return dataArray;
}

function hourly(data, selectedDate) {
    let dataArray = names.HOURS.map(value => {
        return {
            name: value,
            leads: sum('leads', hourlyFilter(value, data), 0),
            revenueLeads: sum('revenueLeads', hourlyFilter(value, data)),
            revenueCalls: sum('revenueCalls', hourlyFilter(value, data)),
        };
    });
    return dataArray;
}

module.exports.levelSwitcher = levelSwitcher;
module.exports.subLevelFilter = subLevelFilter;
module.exports.campaigns = campaigns;
module.exports.buyers = buyers;
module.exports.daily = daily;
module.exports.hourly = hourly;