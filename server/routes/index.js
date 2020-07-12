const express = require('express')
const app = express()
app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./airdrop'))
app.use(require('./categoria'))


module.exports = app


//Wrong code
// module.exports = () => {
//     require('./usuario')
//     require('./login')
// }