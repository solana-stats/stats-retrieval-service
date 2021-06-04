const client = require('../config/db.config')

const insertNewBlock = (keys, values) => {
  let keyQuery = createQuery(keys);
  let valuesQuery = createQuery(values);
  let query = `INSERT INTO stats.block_stats (${keyQuery}) VALUES (${valuesQuery})`;
  client.query(query, (err, res) => {
    if (err) {
      console.log(`Error inserting slot ${values[0]}`);
      console.log(err);
    } else {
      console.log(`Insertion of slot ${values[0]} successful`)
    }
  });
}

const getTasks = async () => {
  return client.query(`SELECT slot FROM STATS.TASKS WHERE OWNER = '${process.env['taskName']}'`);
}

const cleanUpTasks = async () => {
  await client.query(`DELETE FROM STATS.TASKS WHERE OWNER = '${process.env['taskName']}'`);
  await client.query(`DELETE FROM STATS.TASKS WHERE START_TIME < (NOW() - INTERVAL '10' MINUTE )`)
}

const scheduleTasks = async () => {
  await getTaskPosition();

  let lastSlot = await client.query(`select block from stats.block_stats where mod (block, 2) = ${process.env['taskPosition']} order by block desc limit 1`);
  let latestTask = await client.query(`select slot from stats.tasks where mod (block, 2) = ${process.env['taskPosition']} order by slot desc limit 1`);

  let latestScheduled = 0;
  if (!latestTask.rows[0] || lastSlot.rows[0].block >= latestTask.rows[0].slot) {
    latestScheduled = lastSlot.rows[0].block;
  } else {
    latestScheduled = latestTask.rows[0].slot;
  }
  console.log(process.env['taskPosition'])
  let tasks = [...Array(100).keys()]
    .filter((a,i)=>i%2 === parseInt(process.env['taskPosition']))
    .map(i => i + latestScheduled + 1 + latestScheduled%2);
  console.log(tasks);
  let query = createInsertTaskQuery(tasks);
  await client.query(query);
}

const createInsertTaskQuery = (tasks) => {
  let query = 'INSERT INTO STATS.TASKS (slot, task_type, owner, start_time, task_position) VALUES ';
  let currentTimestamp = "'" + new Date().toISOString() + "'"
  tasks.forEach(slot => query += `(${slot}, 'retrieval', '${process.env['taskName']}', ${currentTimestamp}, ${process.env['taskPosition']}),`);
  return query.replace(/,\s*$/, "");
}

const getTaskPosition = async () => {
  if (!process.env['taskPosition']) {
    let taskPosition = await client.query(`select task_position from stats.tasks order by slot desc limit 1`);
    if (!taskPosition.rows[0]) {
      process.env['taskPosition'] = 0;
    } else {
      process.env['taskPosition'] = 1;
    }
  }
  return process.env['taskPosition'];
}

const createQuery = (keys) => {
  let keyQuery = '';
  keys.forEach(key => keyQuery += key + ',');
  return keyQuery.replace(/,\s*$/, "");
}

exports.insertNewBlock = insertNewBlock;
exports.getTasks = getTasks;
exports.scheduleTasks = scheduleTasks;
exports.cleanUpTasks = cleanUpTasks;