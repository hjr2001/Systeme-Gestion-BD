class Helper {

    static sendJsonRes(res, data){
        res.write(JSON.stringify(data));
        return res.end();
    }

}

module.exports = Helper