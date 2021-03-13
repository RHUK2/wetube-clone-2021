// import dotenv from 'dotenv';
// dotenv.config();

import mongooses from 'mongoose';

mongooses.connect(
  process.env.PRODUCTION
    ? process.env.ATLAS_CONNECTION_KEY
    : process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
);

const db = mongooses.connection;

const handleOpen = () => {
  console.log('✔ Conncected to DB');
};
const handleError = error => {
  console.log(`❌ Error on DB Connection:${error}`);
};

db.once('open', handleOpen);
db.on('error', handleError);
