import mongoose from 'mongoose';

// connectDB(DBname) if not it will create a new DB in cluster Matches
export default async function connectDB(Name) {
  const uri = Name
    ? `mongodb+srv://turraniesports:1234mana%40@matches.da46xak.mongodb.net/${Name}?retryWrites=true&w=majority&appName=Matches`
    : `mongodb+srv://turraniesports:1234mana%40@matches.da46xak.mongodb.net/?retryWrites=true&w=majority&appName=Matches`;

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting:", err);
  }
}
