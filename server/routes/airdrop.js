const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

app.post('/message', (req, res) => {
    fs.writeFile(path.resolve(__dirname,'../storage/data.txt'),req.body.data, (err) => {
        if(err)
            throw err;
        res.json({
            ok: true,
            message: 'Data written in linux disk'
        })
    })
})

module.exports = app