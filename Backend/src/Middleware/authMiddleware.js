import jwt from "jsonwebtoken"

const protect = (req,res,next) => {
    try{
        const header = req.headers.authorization

        if(!header || !header.startsWith("Bearer ")){
            return res.status(401).json({
                message:"Not authorized"
            })
        }

        const token = header.split(" ")[1];

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decode
        next();
    }catch(err){
        res.status(401).json({
            message:"Invalid token"
        })
    }
}

export default protect