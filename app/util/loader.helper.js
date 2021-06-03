
const sleep = (ms) => {
  return new Promise ((resolve) => {
    setTimeout(resolve, ms);
  })
}

const convertEpochToTimestamp = (epochTime) => {
  return "'" + new Date(epochTime * 1000).toISOString() + "'";
}

exports.sleep = sleep;
exports.convertEpochToTimestamp = convertEpochToTimestamp;