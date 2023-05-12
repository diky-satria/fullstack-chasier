export const formatNumber = (num) => {
  return "Rp. " + num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
export const formatNumberNoRp = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const getTheFirstLetter = (name) => {
  var first = name[0].toUpperCase();

  return first;
};

export const formatDateHuman = (UNIX_timestamp) => {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = a.getHours() + ":" + a.getMinutes();
  var result = date + "-" + month + "-" + year + " " + time;
  return result;
};

export const transaksiPasienSelected = (langOpt, langSel) => {
  var langSelData = [{ value: langSel }];

  // compare langSelData value the same langOpt value, while the same both of value so add to data=[{value: 'id', label: 'Indonesian'}]
  var data = [];
  for (var a = 0; a < langSelData.length; a++) {
    for (var j = 0; j < langOpt.length; j++) {
      if (langSelData[a].value === langOpt[j].value) {
        data.push({
          value: langOpt[j].value,
          label: langOpt[j].label,
        });
      }
    }
  }

  return data;
};
