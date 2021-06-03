const { getTransactionInfo } = require('./transaction.service');
const { getCurrentSlot, getConfirmedBlock } = require('./rpc.service')
const { sleep, convertEpochToTimestamp } = require('../util/loader.helper')
const { insertNewBlock } = require('./db.service')

const startLoading = async () => {
  let currentSlot = (await getCurrentSlot()).data.result;
  let sleepTime = 400;
  while (true) {
    getConfirmedBlock(currentSlot).then(response => {
      let block = response[1].data;
      let slot = response[0];
      if (block.error && block.error.code === -32007) {
        insertSkippedBlock(slot);
      } else if (block.error && block.error.code === -32004) {
        currentSlot--;
        sleepTime = 5000;
      } else if (block.error) {
        console.log(`Unknown error ${block.error}`);
        console.log(block.error);
        sleepTime = 5000;
      } else {
        analyzeBlock(slot, block.result);
        sleepTime = 500;
      }
    }).catch(reason => {
      console.log(reason);
      currentSlot--;
      sleepTime = 10000;
    });
    currentSlot++;
    await sleep(sleepTime);
  }
}

function analyzeBlock(slot, block) {
  let transactionInfo = getTransactionInfo(block);
  let dbKeys = ['block', 'block_time', 'fee_amt', 'num_transactions',
    'num_failed_transactions', 'num_success_transactions'];
  let dbValues = [slot, convertEpochToTimestamp(block.blockTime), transactionInfo.fees, transactionInfo.total,
    transactionInfo.numFailed, transactionInfo.numSuccess];
  insertNewBlock(dbKeys, dbValues);
}

function insertSkippedBlock(slot) {
  let dbKeys = ['block', 'skipped'];
  let dbValues = [slot, true];
  insertNewBlock(dbKeys, dbValues);
}

exports.startLoading = startLoading;