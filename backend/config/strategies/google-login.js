const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../model/sellerModel');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://midnightfuel.onrender.com/api/seller/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails && profile.emails[0]?.value;
            const name = profile.displayName;
            const googleId = profile.id;
            const picture = profile.photos && profile.photos[0]?.value;

            let user = await User.findOne({ googleId });

            // If user not found via googleId, check via email
            if (!user && email) {
                user = await User.findOne({ email });
            }

            if (!user) {
                // Create a new user with default/fake values for required fields
                user = new User({
                    googleId,
                    name,
                    email,
                    picture,
                    phone: '0000000000',
                    UID: 999999,
                    hostel: 'NA',
                    room: 'NA',
                    varified: false
                });
                await user.save();
            } else {
                // Update Google ID if missing
                if (!user.googleId) {
                    user.googleId = googleId;
                    await user.save();
                }
            }

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));
};
