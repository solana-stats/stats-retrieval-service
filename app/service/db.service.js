const client = require('../config/db.config')

const insertNewBlock = (keys, values) => {
  let keyQuery = createQuery(keys);
  let valuesQuery = createQuery(values);
  let query = `INSERT INTO stats.block_stats (${keyQuery}) VALUES (${valuesQuery})`;
  console.log(query);
  client.query(query, (err, res) => {
    if (err) {
      console.log(`Error inserting slot ${values[0]}`);
      console.log(err);
    } else {
      console.log(`Insertion of slot ${values[0]} successful`)
    }
  });
}

const createQuery = (keys) => {
  let keyQuery = '';
  keys.forEach(key => keyQuery += key + ',');
  return keyQuery.replace(/,\s*$/, "")
}

exports.insertNewBlock = insertNewBlock;