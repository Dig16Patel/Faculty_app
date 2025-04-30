import crypto from 'crypto';

// Generate a random 64-byte key and convert it to base64
const generateSecretKey = () => {
  const key = crypto.randomBytes(64).toString('base64');
  console.log('Generated JWT Secret Key:');
  console.log(key);
  return key;
};

generateSecretKey(); 