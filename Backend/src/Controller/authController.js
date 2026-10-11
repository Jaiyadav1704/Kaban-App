import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../Prisma/client.js";

export const register = async(req,res) => {
    try {
        const {name, email, password} = req.body

        const existinguser = await prisma.user.findUnique({
            where: {
                email,
            }
        })

        if(existinguser){
            return res.status(400).json({
                message:"User already exists",
            })
        }

        const hashpass = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashpass
            }
        })

        const token = jwt.sign(
        {id: user.id,},
        process.env.JWT_SECRET,
        {expiresIn: "7d",}
        );

        res.status(200).json({
            message:"User created successfully",
            token,
            user
        })
    } catch(error){
        res.status(500).json({
            message: error.message,
        })
    }

}

export const login = async (req,res) => {
    try{
        const {email, password} = req.body

        const user = await prisma.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }

        const isPassword = await bcrypt.compare(password, user.password)

        if(!isPassword){
            return res.status(401).json({
                message:"Invalid credentails"
            })
        }

        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )

        res.status(200).json({
            message:"Login success",
            token,
            user
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

export const getUsers = async(req,res) => {
    try{
        const users = await prisma.user.findMany({
            select:{
                id:true,
                name:true,
                email:true
            }
        })
        res.status(200).json(users)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:err.message
        })
    }
}