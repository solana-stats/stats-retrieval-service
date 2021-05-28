
const getFees = (block) => {
  let feeAmount = 0;
  for (const transaction of block.transactions) {
    if (transaction.meta && transaction.meta.fee) {
      feeAmount += transaction.meta.fee;
    }
  }
  return feeAmount;
}

exports.getFees = getFees;