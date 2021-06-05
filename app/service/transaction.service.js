
const getTransactionInfo = (block) => {
  let feeAmount = 0;
  let numFailed = 0;
  let numSuccess = 0;
  let numVote = 0;

  for (const transaction of block.transactions) {
    feeAmount += getFee(transaction);
    if (isFailed(transaction)) {
      numFailed += 1;
    } else {
      numSuccess += 1;
    }
    if (isVote(transaction)) {
      numVote += 1;
    }
  }

  return {
    'fees': feeAmount,
    'total': getNumTransactions(block),
    'numFailed': numFailed,
    'numSuccess': numSuccess,
    'numVote': numVote
  }
}

const isFailed = (transaction) => {
  if (transaction.meta && transaction.meta.err) {
    return true;
  }
  return false;
}

const isVote = (transaction) => {

  transaction = transaction.transaction;
  if (transaction && transaction.message && transaction.message.instructions) {
    if (transaction.message.instructions[0].program === "vote") {
      return true;
    }
  }
  return false;
}

const getFee = (transaction) => {
  if (transaction.meta && transaction.meta.fee) {
    return transaction.meta.fee;
  }
  return 0;
}

const getNumTransactions = (block) => {
  return block.transactions.length;
}

exports.getTransactionInfo = getTransactionInfo;