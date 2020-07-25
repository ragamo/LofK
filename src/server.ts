import './dotenv';
import express from 'express';
import Lofk from './core/Lofk';

// Healthcheck
const httpServer = express();
httpServer.get('/', (req, res) => {
  return res.status(200).end();
});

httpServer.listen(8080, '0.0.0.0', () => {
  console.log('🌎 HTTP server started on 0.0.0.0:8080');
  new Lofk(['discord']);
});