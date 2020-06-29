process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


let urlDB;

if(process.env.NODE_ENV === 'env')
    urlDB = 'mongodb://localhost:27017/cafe'
else
    urlDB = "mongodb://5kullking:2686@cluster0-shard-00-00-cqy3i.mongodb.net:27017,cluster0-shard-00-01-cqy3i.mongodb.net:27017,cluster0-shard-00-02-cqy3i.mongodb.net:27017/cafe?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
    
process.env.URL_DB = urlDB