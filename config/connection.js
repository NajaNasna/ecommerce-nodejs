const mongoClient = require('mongodb').MongoClient
const state = {
    db: null
}


module.exports.connect = function (done) {
    const url = 'mongodb://127.0.0.1:27017'
    const dbname = 'shopping'

   
    mongoClient.connect(url).then(data => {

        state.db = data.db(dbname)
        done()

    }).catch(err => {
        return done(err)
    })


}

module.exports.get = function () {
    return state.db
}