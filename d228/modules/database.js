var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "211.53.209.159",
    user: "d228",
    password: "eothrhpr2",
    database: "d228"
});

var database = {
    
    executeQuery: function(query, callback, callbackFail) {
        pool.getConnection((err, connection) => {
            if (err)
            {
                if (err.code === 'PROTOCOL_CONNECTION_LOST')
                {
                    console.error("Database connection was closed.");
                }
                else if (err.code === 'ER_CON_COUNT_ERROR') 
                {
                    console.error('Database has too many connections.')
                }
                else if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.')
                }

                if (callbackFail)
                {
                    callbackFail(err);
                }
            }
        
            if (connection) 
            {
                connection.query(query, function(err, result, fields) {
                    if (err)
                    {
                        var msg = "서버 오류입니다. 개발자에게 문의하세요.";

                        if (err.code == 'ER_BAD_FIELD_ERROR')
                        {
                            msg = "SQL 오류입니다. 개발자에게 문의하세요.";
                        }

                        console.log("error ", err);
                        //throw err;
                        if (callbackFail)
                        {
                            callbackFail(msg);
                        }
                        return;
                    }

                    if (callback)
                    {
                        var str = JSON.stringify(result);
                        var json = JSON.parse(str);

                        if (json.length == 1)
                        {
                            callback(json[0]);
                        }
                        else
                        {
                            callback(json);
                        }
                    }
                });

                connection.release();
            }
        
            return;
        });
    }
};

/*
pool.getConnection((err, connection) => {
    if (err)
    {
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
        {
            console.error("Database connection was closed.");
        }
        else if (err.code === 'ER_CON_COUNT_ERROR') 
        {
            console.error('Database has too many connections.')
        }
        else if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }

    if (connection) 
    {
        connection.release();
    }

    return;
});
*/

module.exports = database;