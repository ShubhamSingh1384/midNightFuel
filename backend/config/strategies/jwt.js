const passport = require('passport');
const {Strategy: jwtStrategy} = require('passport-jwt');
const User = require('../../model/sellerModel');

const cookiesExtracter = req => req.cookies?.token;


module.exports = (passport) =>{
    passport.use(new jwtStrategy({
        jwtFromRequest : cookiesExtracter,
        secretOrKey : process.env.JWT_SECRET_KEY
    }, async(payload, done) =>{
        try {
            const user = await User.findById(payload.sellerId); // sub is the user id from jwt token in googleCallback
            console.log("user form jwt token", user);
            if(user){
                done(null, user);
            }
            else{
                done(null, false);
            }
        } catch (error) {
            done(error, false);
        }
    }))
}