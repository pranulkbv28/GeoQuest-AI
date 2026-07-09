const configuration = () => ({
  nodeEnv: process.env.NODE_ENV,

  port: parseInt(process.env.PORT ?? '3001', 10),

  api: {
    prefix: process.env.API_PREFIX ?? 'api',
    version: process.env.API_VERSION ?? '1',
  },
});

export default configuration;
