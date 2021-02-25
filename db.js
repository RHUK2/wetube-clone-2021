import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

const handleOpen = () => {
  console.log('✔ Conncected to DB');
};
const handleError = error => {
  console.log(`❌ Error on DB Connection:${error}`);
};

db.once('open', handleOpen);
db.on('error', handleError);
