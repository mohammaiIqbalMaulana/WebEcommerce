import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Headers received:', req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('No authorization header');
        return res.status(401).json({ message: "Authorization is required" });
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
        console.log('No access token found in header');
        return res.status(401).json({ message: "Authorization is required" });
    }

    try {
        console.log('Attempting to verify token');
        const decodedToken = await auth.verifyIdToken(accessToken);
        console.log('Token verified successfully:', decodedToken);
        req.uid = decodedToken.uid;
        req.role = decodedToken.role;
        next();
    } catch (error: any) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};