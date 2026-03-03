import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// En ES modules, __dirname n'existe pas nativement, on le recrée à partir de import.meta.url
// import.meta.url donne l'URL absolue du fichier actuel (ex: file:///C:/...mern/server/db/connection.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // => C:/Users/Valentin/Desktop/mern/server/db

// On construit un chemin absolu vers config.env, indépendant de l'endroit où Node est lancé
// __dirname + ".." => mern/server/db + .. => mern/server/ => où se trouve config.env
const configPath = join(__dirname, "..", "config.env");
console.log("Chemin utilisé :", configPath); // Pour vérifier
const result = dotenv.config({ path: configPath });
console.log("Résultat dotenv :", result.parsed); // Doit afficher { ATLAS_URI: '...', PORT: '5050' }

import { MongoClient } from "mongodb";

const uri = process.env.ATLAS_URI;
console.log("URI chargée :", uri);

const client = new MongoClient(uri);

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} catch(err) {
  console.error(err);
}

let db = client.db("dummydb");
export default db;