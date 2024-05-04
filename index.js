import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3500;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL).then( ()=> {
        console.log('Database is connected successfully.');
        app.listen(PORT, () => {
            console.log('Server is running on port ${PORT}');
        });
    }).catch((error) => console.log(error));


// create model user to save on database as model for django

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    age: Number,
});

const UserModel = mongoose.model("users", userSchema)

// endpoint pour lister les users dans la bd
app.get("/get_users", async (req, res) =>{
    const userData = await UserModel.find();
    res.json(userData)
});
