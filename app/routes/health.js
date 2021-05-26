
async function healthCheck(req, res) {
  res.send('Retrieval Service is healthy');
}

module.exports = healthCheck;