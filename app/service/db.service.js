const client = require('../config/db.config')

const insertNewBlock = (keys, values) => {
  client.query('SELECT * FROM stats.block_stats', (err, res) => {
    if (err) {
      console.log(`Error inserting slot ${values[0]}`);
    } else {
      console.log(`Insertion of slot ${values[0]} successful`)
    }
  });
}

exports.insertNewBlock = insertNewBlock;