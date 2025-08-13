import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User, IUser } from '../models/User';
import { config } from './config';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: config.google.clientId,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackUrl
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails?.[0]?.value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.isEmailVerified = true;
      if (!user.avatar && profile.photos?.[0]?.value) {
        user.avatar = profile.photos[0].value;
      }
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    const newUser = new User({
      googleId: profile.id,
      email: profile.emails?.[0]?.value,
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      avatar: profile.photos?.[0]?.value || '',
      isEmailVerified: true,
      role: 'student' // Default role
    });
    
    await newUser.save();
    done(null, newUser);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    done(error, undefined);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;