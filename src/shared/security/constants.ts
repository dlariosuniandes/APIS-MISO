const jwtConstants = {
  JWT_SECRET: process.env.SECRET_KEY || 'secretKey',
  JWT_EXPIRES_IN: '2h',
};

export const resourcesList = [
  'products',
  'cultures',
  'countries',
  'users',
  'recipes',
  'restaurants',
  'micheline-stars',
];

export default jwtConstants;
