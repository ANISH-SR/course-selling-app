const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {auth, JWT_SECRET} = require("./auth");
const { z } = require("zod");
const {UserModel} = require("./db");
const {connect} = require("mongoose");

const port = process.env.PORT || 3000;
mongoose.connect("");

const app = express();
app.use(express.json());

app.post("/user/signup", async (req,res)=>{
    const required_body = z.object({
        email: z.string().email(
            {message: "Invalid email address."}
        ),
        name: z.string(),
        password: z.string()
    })

    const parseddatawithsucess = required_body.safeParse(req.body);

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;



    try{
        const hashed_password = await bcrypt.hash(password, 5);
        console.log(hashed_password);

        await UserModel.create({
            email: email,
            password: hashed_password,
            name: name
        })

        res.json({
            message: "You are signed up"
        })
    }catch (e){
        res.json({
            message: "User Already exists"
        })
    }

})

app.post("/user/signin", async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email
    });

    if(!user){
        res.status(403).json({
            message: "User does not exist in out db."
        })
    }
    const password_match = await bcrypt.compare(password, user.password);

    if(password_match){
        const token =  jwt.sign({
            id: user._id.toString()
        },JWT_SECRET);

        res.json({
            token: token
        });
    }else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }

})

app.get("/course/preview", auth, async (req,res)=>{

})

app.get(`/user/purchases`, auth, async (req, res)=>{

})

app.post(`/course/purchase`, auth, async (req, res)=>{

})

app.listen(port, ()=>{
    console.log(`The server is running on port  ${port}`);
})