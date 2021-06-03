const { getFees } = require('./transaction.service');
const { getCurrentSlot, getConfirmedBlock } = require('./rpc.service')
const { sleep } = require('../util/loader.helper')
const { insertNewBlock } = require('./db.service')

const startLoading = async () => {
  let currentSlot = (await getCurrentSlot()).data.result;
  let sleepTime = 500;
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
  let dbKeys = ['block', 'block_time', 'fee_amt'];
  let dbValues = [slot, block.blockTime, getFees(block)];
  console.log(dbValues);
  insertNewBlock(dbKeys, dbValues);
}

function insertSkippedBlock(slot) {
  let dbKeys = ['block', 'skipped'];
  let dbValues = [slot, true];
  insertNewBlock(dbKeys, dbValues);
}

exports.startLoading = startLoading;