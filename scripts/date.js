// created variable that makes a date
var makeDate = function() {

    // new date variable
    var d = new Date();

    // created variable that holds empty string
    var formattedDate = "";

    // add month to string. (Months start at 0 index, so add 1)
    formattedDate += (d.getMonth() + 1) + "_";
    // add date to string
    formattedDate += d.getDate() + "_";
    // add year to string
    formattedDate +=d.getFullYear();
    // return full the full date
    return formattedDate;
};
// export full date
module.exports = makeDate;