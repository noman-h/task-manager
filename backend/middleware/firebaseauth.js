const {getAuth} = require('firebase-admin/auth');


module.exports= async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  
  const token = authHeader.split('Bearer ')[1];

  try {
    // Cryptographically verify the token structure and expiration
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken; // Contains uid, email, etc.

    next();
  } catch (error) {
    console.log(error);
    
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};