const LocaStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById){
    const uathenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        if (user == null ){
            return done(null, false, { message: 'No user with that email'})
        }

        try {
            if (await bcrypt.compare(password, user.salt+user.hashedpassword)){
                return done(null, user)
            }
            else {
                return done(null, false, { message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocaStrategy({ usernameField: 'email'}, uathenticateUser))

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        done(null, user);
    });
}

module.exports = initialize