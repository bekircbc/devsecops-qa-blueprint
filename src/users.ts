import http, { IncomingMessage, ServerResponse } from 'node:http';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Mock database records
const users: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@sirina.de', role: 'DevSecOps Engineer' },
  { id: 2, name: 'Bob Jones', email: 'bob@sirina.de', role: 'QA Automation Lead' },
  { id: 3, name: 'Carol White', email: 'carol@sirina.de', role: 'Security Architect' }
];

const PORT = process.env.PORT || 3000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || '';
  const method = req.method || 'GET';

  // Set standard CORS and JSON headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // GET /api/v1/users - Return all users
  if (method === 'GET' && url === '/api/v1/users') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'success', data: users }));
    return;
  }

  // GET /api/v1/users/:id - Return single user by ID
  const userMatch = url.match(/^\/api\/v1\/users\/(\d+)$/);
  if (method === 'GET' && userMatch) {
    const userId = parseInt(userMatch[1], 10);
    const user = users.find((u) => u.id === userId);

    if (user) {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', data: user }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ status: 'error', message: `User with ID ${userId} not found` }));
    }
    return;
  }

  // Health check endpoint for CI/CD and Docker probes
  if (method === 'GET' && (url === '/' || url === '/health')) {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    return;
  }

  // 404 Fallback for unknown routes
  res.writeHead(404);
  res.end(JSON.stringify({ status: 'error', message: 'Route not found' }));
});

// Start persistent HTTP server listening on configured PORT
server.listen(PORT, () => {
  console.log(`[Server] REST API service listening at http://localhost:${PORT}`);
});