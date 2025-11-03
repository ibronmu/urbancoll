import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  db: {
    url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydb',
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || 'your-paystack-secret-key',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
};

export default config;