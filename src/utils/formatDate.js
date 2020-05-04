const formatDate = (dateRaw) => {
  let hours = dateRaw.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let minutes = dateRaw.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let seconds = dateRaw.getSeconds();
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours + ':' + minutes + ':' + seconds + ' ' + period;
};


module.exports = formatDate;
