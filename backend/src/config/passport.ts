import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Estratégia para Cliente
passport.use(
  'google-cliente',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL_CLIENTE || 'http://localhost:3001/api/auth/google/cliente/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, displayName: nome, emails, photos } = profile;
        const email = emails?.[0]?.value;
        const foto = photos?.[0]?.value;

        if (!email) {
          return done(new Error('Email não fornecido pelo Google'), undefined);
        }

        return done(null, {
          googleId,
          nome,
          email,
          foto,
        });
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

// Estratégia para Dono
passport.use(
  'google-dono',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL_DONO || 'http://localhost:3001/api/auth/google/dono/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, displayName: nome, emails, photos } = profile;
        const email = emails?.[0]?.value;
        const foto = photos?.[0]?.value;

        if (!email) {
          return done(new Error('Email não fornecido pelo Google'), undefined);
        }

        return done(null, {
          googleId,
          nome,
          email,
          foto,
        });
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
