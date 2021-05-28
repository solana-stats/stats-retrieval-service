const { getFees } = require('./transaction.service');
const { getCurrentSlot, getConfirmedBlock } = require('./rpc.service')
const { sleep } = require('../util/loader.helper')
const { insertNewBlock } = require('./db.service')

const startLoading = async () => {
  let currentSlot = (await getCurrentSlot()).data.result;
  let sleepTime = 200;
  while (true) {
    getConfirmedBlock(currentSlot).then(response => {
      let block = response[1].data;
      let slot = response[0];
      if (block.error && block.error.code === -32007) {
        // Insert Skipped Block;
      } else  if (block.error && block.error.code === -32004) {
        currentSlot--;
        sleepTime = 1000;
      } else {
        analyzeBlock(slot, block.result);
        sleepTime = 200;
      }
    });

    currentSlot++;
    await sleep(sleepTime);
  }
}

function analyzeBlock(slot, block) {
  let dbKeys = ['block', 'block_time', 'fee_amt'];
  let dbValues = [slot, block.blockTime, getFees(block)];
  insertNewBlock(dbKeys, dbValues);
}

exports.startLoading = startLoading;