import app from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`🚀 NASA Explorer API server running on port ${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(
    `🔑 NASA API Key: ${config.nasaApiKey !== 'DEMO_KEY' ? 'Configured' : 'Using DEMO_KEY'}`
  );
  console.log(`🌐 CORS enabled for: ${config.frontendUrl}`);
  console.log(`📊 Health check: http://localhost:${config.port}/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
