export const jwtConstants = {
  secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : 'secret',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES ? process.env.JWT_EXPIRES : '10m',
  },
};
