const config = {
  env: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  jwtSecret:
    process.env.JWT_SECRET || 'abdboabfuubdqwd9397835bubdvszczcsnklcnscsnfmsjf',
};

export default config;
