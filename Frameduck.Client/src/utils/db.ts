
export class Db {

    // call sql statement 
    public exec(sql: string) {

        console.log(sql);

        var sequelize = new sequelize('FrameduckDevel', 'Frameduck', 'JKj1BBQWAkjYLdXT4zry', {
            host: 'test.lorenzo.cz',
            dialect: 'mssql',

            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },

        });

        sequelize.query(
            sql,
            {
                type: sequelize.QueryTypes.SELECT
            }).then(function (result) {
                console.log('done');
                console.log(result)
            }).catch(function (error) {
                console.log(error);
            });
    }

    private logStatement() {

    }
}
