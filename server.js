//Express
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

//create an express instance
const app = express();
app.use(express.json());
app.use(cors())

//sample in-memory storage for todo items
// let todos =[];

//connecting mongo db
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('DB connected')
})
.catch((err)=>{
    console.log(err)
})

//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//creating model
const todoModel = mongoose.model('Todo',todoSchema);

//create a new todo item
app.post('/todos',async(req,res)=>{
    const {title,description} =req.body;
    // const newTodo = {
    //     id: todos.length+1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);

    try{
        const newTodo = new todoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

//get all items
app.get('/todos',async(req ,res) => {
    try {
        const todos =await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
    
})

//upadte todo item
app.put("/todos/:id",async(req,res)=>{
    try {
        const {title,description} =req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new:true}
        )
        if(!updatedTodo){
            return res.status(404).json({message:"Todo not found"})
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
    
})

//delet a todo item
app.delete('/todos/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        await todoModel.findOneAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
    
})

//start the server
const port =8000;
app.listen(port,()=>{
    console.log("server is listening "+port);
})