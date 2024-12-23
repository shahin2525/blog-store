import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  jwt_secret: process.env.JWT_SECRET_KEY,
  bcrypt_salt: process.env.BCRYPT_SALT,
};
