const MongoClient = require('mongodb').MongoClient;
const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gc6yg.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
//'mongodb://localhost:27017';


async function addcardtosess(sid){

    const client = await MongoClient.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        console.log('no client')
        return;
    }

    try {

        const db = client.db("test");  ///changethere

        let collection = db.collection('sessions');

        let query = { '_id': sid }
        let ins = {$set:{'session.cart':{items:[]}}}

        const options = {
                    // sort returned documents in ascending order by title (A->Z)
                    // sort: { title: 1 },
                    // Include only the `title` and `imdb` fields in each returned document
                    // projection: { password: 1},
                    };

        
            await collection.updateOne(query, ins)
            return 'nice'
       

    } catch (err) {

        console.log(err);
    } finally {
        client.close();
    }
}

module.exports = {addcardtosess}