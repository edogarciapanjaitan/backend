import { Request, Response, NextFunction } from "express";
import { login } from "../services/auth.service";
import { register } from "../services/auth.service";

export async function loginController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {   
        const { email, password } = req.body;
        const data = await login(email, password);

        res.json({
            message: "OK",
            data, 
        });
    } catch (err) {
        next(err);
    }
    
}

export async function registerController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {   
        const { email, password, name } = req.body;

        const data =  await register({email, password, name});

        res.json({
            message: "OK",
            data,
        });
        
    } catch (err) {
        next(err);
    }
    
}

