const fs = require('fs');

function js(file, req, res) {
    const js = fs.readFileSync(`${__dirname}/../public/js/${file}`);
    res.write(js);
    return res.end();
}

function css(file, req, res) {
    const js = fs.readFileSync(`${__dirname}/../public/css/${file}`);
    res.write(js);
    return res.end();
}

module.exports = { js, css }