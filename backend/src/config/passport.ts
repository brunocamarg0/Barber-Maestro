import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Só configurar Google OAuth se as credenciais estiverem disponíveis
const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientID && googleClientSecret) {
  // Estratégia para Cliente
  passport.use(
    'google-cliente',
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
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
        clientID: googleClientID,
        clientSecret: googleClientSecret,
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

  console.log('✅ Google OAuth configurado');
} else {
  console.log('⚠️  Google OAuth não configurado (GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não encontrados)');
  console.log('   Login com Google estará desabilitado até que as credenciais sejam configuradas');
}

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
