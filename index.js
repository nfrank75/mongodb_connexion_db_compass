import express from "express";  // import Express framework
import mongoose from "mongoose"; //import mongoose for mongodb interactions/connexion
import dotenv from "dotenv"; // import dotenv for loading .env file to use the environment variables

// Initialize Express app
const app = express();

app.use(express.json());

// Load environment variables from .env file
dotenv.config();

// Define port for the server to listen on
const PORT = process.env.PORT || 3500;


// Load environment variables from .env file
const MONGODB_URL = process.env.MONGODB_URL;

// Connect to MongoDB database
mongoose.connect(MONGODB_URL).then( ()=> {
        console.log('Database is connected successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`); 
        });
    }).catch((error) => console.log(error));


// create model user to save on database as model for django
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter the name"]
        },
        password: {
            type: String,
            required: [true, "Enter the password"]
        },
        age: {
            type: Number,
            required: true,
            default: 0
        },
    
    },
    {
        timestamps: true  // this field = created_at + updated_at
    }
);

const UserModel = mongoose.model("users", userSchema);

// module.exports = UserModel;

// app.get("/get_users", async (req, res) =>{
//     const userData = await UserModel.find({});
//     res.status(200).json(userData)
// });


// endpoint pour lister tous les users dans la bd
app.get("/get_users", async (req, res) =>{
    try {
        const all_users = await UserModel.find({});
        res.status(200).json(all_users)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});


// endpoint pour lister specifiquement un user dans la bd
app.get("/get_users/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const one_user = await UserModel.findById(id);
        if(!one_user){
            return res.status(404).json({message: `can not find a user with that id:  ${id}`})
        }
        res.status(200).json(one_user)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});


// endpoint pour ajouter un user dans la bd
app.post("/add_user", async (req, res) =>{
    try {
        const add_a_user = await UserModel.create(req.body);
        res.status(201).json(add_a_user);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});


// endpoint pour update un user specifique dans la bd
app.put("/update_user/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const update_user = await UserModel.findByIdAndUpdate(id, req.body);
        if(!update_user){
            return res.status(404).json({message: `can not find a user with that ${id}`})
        }
        res.status(200).json(update_user);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});


// endpoint pour supprimer un user specifique dans la bd
app.delete("/delete_user/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const delete_user = await UserModel.findByIdAndDelete(id);
        if(!delete_user){
            return res.status(404).json({message: `can not find a user with that ${id}`})
        }
        res.status(200).json(delete_user);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});