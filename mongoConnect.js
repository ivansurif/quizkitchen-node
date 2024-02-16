import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { recordSchema } from './schemas/schemas.js';

dotenv.config({ path: '.env.public' }); // Load public configurations
dotenv.config({ path: '.env.private' }); // Load private configurations

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_SECRET}@quizzer.k78n1l2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

async function insertRecord(record, collection, db) {
  const { error, value } = recordSchema.validate(record);
  console.log(record);
  console.log(collection);
  console.log(db);
  if (error) {
    console.log('Validation error:', error.details);
    throw new Error('Data Validation Error');
  } else {
    console.log('Valid data:', value);
    try {
                    // Connect to the "insertDB" database and access its "haiku" collection
          const database = client.db(db);
          const collection_ = database.collection(collection);
          const result = await collection_.insertOne(record);
          // Print the ID of the inserted document
          console.log(`A document was inserted with the id: ${result.insertedId}`);
          return {
              db: db,
              collection: collection,
              record: record,
              insertedId: result.insertedId
          };
      } catch (error) {
          console.log("Error during record insertion:", error);
          throw error; // Rethrow the error to be handled by the caller
      }
      finally {
        // Close the MongoDB client connection
          //   await client.close();
      }}
  }


  async function getRandomRecord(collection, db) {
    try {
        console.log(collection);
        console.log(db);
        // Connect to the "insertDB" database and access its "haiku" collection
        const database = client.db(db);
        const collection_ = database.collection(collection);
        // const result = await collection_.distinct("projectName");
        const result = await collection_.find({}, { projection: {_id: 1} }).toArray();
        console.log(result);
        result.forEach(item => {
          console.log(item._id.toString()); // This will log the string representation of the ObjectId
      });
        // console.log(result);
        const randomIndex = Math.floor(Math.random() * result.length);
        const randomId = result[randomIndex]._id; // This is an ObjectId
        const randomIdString = randomId.toString();
        console.log(randomIdString);
        const record = await collection_.findOne({ _id: new ObjectId(randomIdString) });
        return record
    } catch (error) {
        console.error("Error during record retrieval:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
    finally {
       // Close the MongoDB client connection
        //   await client.close();
    }
  }
// Export the client and run function
export { run, insertRecord, getRandomRecord };
