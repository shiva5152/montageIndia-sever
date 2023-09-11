// cratering token and saving in cookie
import { Response } from "express";
export default (user:any, statusCode:number, res:Response) => {
  const token = user.createJWT();
  // one day=24*60*60*1000
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() +  24*60*60*1000),
    // secure: process.env.NODE_ENV === 'production',
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
