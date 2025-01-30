import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  jwt_secret: process.env.JWT_SECRET_KEY,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET_KEY,

  bcrypt_salt: process.env.BCRYPT_SALT,
};
