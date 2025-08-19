const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const User = require('../models/User');

// Configurar estratégia Steam
passport.use(new SteamStrategy({
    returnURL: `${process.env.BASE_URL}/api/auth/steam/return`,
    realm: process.env.BASE_URL,
    apiKey: process.env.STEAM_API_KEY
}, async (identifier, profile, done) => {
    try {
        console.log('Autenticação Steam - Profile:', profile);
        
        // Criar ou atualizar usuário
        const user = await User.createOrUpdate(profile);
        
        return done(null, user);
    } catch (error) {
        console.error('Erro na autenticação Steam:', error);
        return done(error, null);
    }
}));

// Serializar usuário para sessão
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializar usuário da sessão
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    res.status(401).json({
        success: false,
        message: 'Acesso negado. Faça login via Steam.'
    });
};

// Middleware para verificar se é administrador
const requireAdmin = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            message: 'Acesso negado. Faça login via Steam.'
        });
    }

    // Verificar se o usuário é admin (pode ser configurado via banco de dados)
    const adminSteamIds = process.env.ADMIN_STEAM_IDS ? process.env.ADMIN_STEAM_IDS.split(',') : [];
    
    if (!adminSteamIds.includes(req.user.steam_id)) {
        return res.status(403).json({
            success: false,
            message: 'Acesso negado. Privilégios de administrador necessários.'
        });
    }

    next();
};

module.exports = {
    passport,
    requireAuth,
    requireAdmin
};