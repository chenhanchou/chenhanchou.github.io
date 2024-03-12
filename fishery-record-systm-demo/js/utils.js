// Remove the formatting to get integer data
function intVal(i) {
    return typeof i === 'string'
        ? i.replace(/[\$\-,d]/g, '') * 1
        : typeof i === 'number'
        ? i
        : 0;
};

// pick lastdate in all data, ouotput Date with format "yyyy/mm/dd"
function UpdateTime() {
    let values = getdata_sessionStorage('data');
    let date_idx = colName2Idx('填表日期');
    var Dates = values.map(x => x[date_idx]);
    Dates.splice(0, 1);
    var latestDate = new Date(Math.max.apply(null, Dates.map(dateString => new Date(dateString))));
    var formattedDate = `${latestDate.getFullYear()}/${latestDate.getMonth() + 1}/${latestDate.getDate()}`;
    return formattedDate;
};

/**
 *filter all data by each pondNum, select last data, return array
 * @param {boolean} header
 * @param {Object[]} columns
 */
function PickLastestData(header, columns) {
    const date_idx =  colName2Idx("填表日期");
    var values = getdata_sessionStorage('data');
    var ponds = values.map(x => x[0]);
    var uniquePonds = Array.from(new Set(ponds));
    var filtered = uniquePonds.map(pondNo => {
        var dateItems = values.filter(x => x[0] == pondNo);
        dateItems.sort((a, b) => (new Date(b[date_idx])).getTime() - (new Date(a[date_idx])).getTime());
        
        return dateItems[0].filter((subArray, index) => {
            return columns.includes(index);
        });
    });
    if (header){
        return filtered;
    }else{
        // delete column head
        filtered.splice(0, 1); 
        return filtered;
    }
};

// seperate dataarray by each big area, return array [[areaA_pond], [areaB_pond], [areaC_pond]]
function seperateBigArea(DataArray) {
    var resultArray = [[], [], []];
    DataArray.forEach(element => {
        var firstLetter = element[0].charAt(0);
        firstLetter === 'A' ? resultArray[0].push(element)
        : firstLetter === 'B' ? resultArray[1].push(element)
        : firstLetter === 'C' ? resultArray[2].push(element)
        : console.error("pond number error");
    });

    return resultArray;
}

function calcReleasedNum() {
    var DataArray = PickLastestData(false, [1,3]);
    var DataArray_sep = seperateBigArea(DataArray);             

    var resultArray = [];
    DataArray_sep.forEach(AreaArray => {
        var count = 0;
        AreaArray.forEach(element => {
            if (element[1] !== '蓄水池') {
                count += 1;
            }
        })
        resultArray.push(count);
    })
    return resultArray
};

function calcUsedNum() {
    var DataArray = PickLastestData(false, [1,5]);
    var DataArray_sep = seperateBigArea(DataArray);             

    var resultArray = [];
    DataArray_sep.forEach(AreaArray => {
        var count = 0;
        AreaArray.forEach(element => {
            if (element[1].substring(0, 3) !== '未放養') {
                count += 1;
            }
        })
        resultArray.push(count);
    })
    return resultArray
};

function clacPondNum() {
    var DataArray = PickLastestData(false, [1]);
    var DataArray_sep = seperateBigArea(DataArray); 
    
    var resultArray = [];
    DataArray_sep.forEach(AreaArray => {
        var count = 0;
        AreaArray.forEach(element => {
            count += 1
        })
        resultArray.push(count);
    })
    return resultArray;
}

function colName2Idx(namestring) {
    var values = getdata_sessionStorage('data');
    if (values[0].indexOf(namestring) >= 0) {
        return values[0].indexOf(namestring);
    } else {
        console.error("error: not found '" + namestring + "'in data col!");
    }
}

function getdata_sessionStorage(namestring) {
    var datastring = sessionStorage.getItem(namestring);
    var values = JSON.parse(datastring);

    return values;
}

function getDateString() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);
    return year + month + day;
}

function numformat_t_f2(number){
    var formattedNumber = number.toLocaleString('en-US', {maximumFractionDigits: 2});
    return formattedNumber;
}

function numformat_percent(number){
    var formattedNumber = number.toLocaleString('en-US', {style: 'percent'});
    return formattedNumber;
}

function weight_transform(value, ori_unit, trans_unit){
    const conversionRates = {
        '公斤': {
          '斤': 1.67,
          '兩': 26.67,
        },
        '斤': {
          '兩': 16,
          '公斤': 0.6,
        },
        '兩': {
          '公斤': 0.0375,
          '斤': 0.0625,
        },
    };
    if (!(ori_unit in conversionRates) || !(trans_unit in conversionRates[ori_unit])) {
        console.error('無效的單位');
    }
    
    const conversionRate = conversionRates[ori_unit][trans_unit];
    return value * conversionRate;
}

function split_num_unit(inputString){
    const resultArray = inputString.split(/([0-9]+)/);

    // 獲取數字和單位
    const number = resultArray[1];
    const unit = resultArray[2];

    return {number, unit};
}
