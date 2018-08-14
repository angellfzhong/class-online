//这个模块里面封装了所有对数据库的常用操作
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID
//数据库连接地址
const dburl = 'mongodb://localhost:27017/myclass'

function _connectDB(callback) {
    var url = dburl;
    //连接数据库
    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(err, db);
    });
}

init();

function init() {
    //对数据库进行初始化
    _connectDB(function (err, db) {
        if (err) {
            console.log(err);
            return;
        }
        db.collection('users').createIndex(
            { "username": 1 },
            null,
            function (err, results) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("索引建立成功");
            }
        );
    });
}

//插入数据
exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).insertOne(json, function (err, result) {
            callback(err, result);
            db.close(); //关闭数据库
        })
    })
};

//查找数据
exports.find = function (collectionName, json, C, D, projection) {
    var result = [];    //结果数组
    if (arguments.length == 3) {
        //那么参数C就是callback，参数D没有传。
        var callback = C;
        var skipnumber = 0;
        //数目限制
        var limit = 0;
    } else if (arguments.length == 4 || arguments.length == 5) {
        var callback = D;
        var args = C;
        //应该省略的条数
        var skipnumber = args.skips || 0;
        //数目限制
        var limit = args.pageamount || 0;
        //排序方式
        var sort = args.sort || {};

    } else {
        throw new Error("find函数的参数个数，必须是3个，或者4个。");
        return;
    }

    //连接数据库，连接之后查找所有
    _connectDB(function (err, db) {
        var cursor = db.collection(collectionName).find(json, projection).skip(skipnumber).limit(limit).sort(sort);
        cursor.each(function (err, doc) {
            if (err) {
                callback(err, null);
                db.close(); //关闭数据库
                return;
            }
            if (doc != null) {

                result.push(doc);   //放入结果数组
            } else {
                //遍历结束，没有更多的文档了
                callback(null, result);
                db.close(); //关闭数据库
            }
        });
    });
}
//根据id查找
exports.findbyId = function (collectionName, id, callback) {
    var result = []
    _connectDB(function (err, db) {
        var cursor = db.collection(collectionName).find({ "_id": ObjectID(id) })
        cursor.each(function (err, doc) {
            if (err) {
                callback(err, null);
                db.close(); //关闭数据库
                return;
            }
            if (doc != null) {
                result.push(doc);   //放入结果数组
            } else {
                //遍历结束，没有更多的文档了
                callback(null, result);
                db.close(); //关闭数据库
            }
        });
    });
}
//按id删除
exports.deleteById = function (collectionName, id, callback) {
    _connectDB(function (err, db) {
        //删除
        db.collection(collectionName).remove(
            { "_id": ObjectID(id) },
            function (err, results) {
                callback(err, results.result); //返回删除结果 {n:1,ok:1}表示删除成功
                db.close(); //关闭数据库
            }
        );
    });
}

exports.deleteMany = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        //删除
        db.collection(collectionName).deleteMany(
            json,
            function (err, results) {
                callback(err, results);
                db.close(); //关闭数据库
            }
        );
    });
}

//修改
exports.updateMany = function (collectionName, json1, json2, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).updateMany(
            json1,
            json2,
            function (err, results) {
                callback(err, results);
                db.close();
            });
    })
}

//得到总数量
exports.getAllCount = function (collectionName, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).count({}).then(function (count) {
            callback(count);
            db.close();
        });
    })
}