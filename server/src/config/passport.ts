import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import userDao from "../dao/user.dao";

// Configure Passport local strategy for email/password
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find user with password
        const user = await userDao.findByEmailWithPassword(email);

        if (!user || !user.password) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Return user (will be stored in session)
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userDao.findById(id);
    if (user) {
      // Return minimal user data for session
      done(null, {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      });
    } else {
      done(null, null);
    }
  } catch (error) {
    done(error);
  }
});

export default passport;
