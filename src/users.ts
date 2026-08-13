import http, { IncomingMessage, ServerResponse } from 'node:http';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@sirina.de', role: 'DevSecOps Engineer' },
  { id: 2, name: 'Bob Jones', email: 'bob@sirina.de', role: 'QA Automation Lead' },
  { id: 3, name: 'Carol White', email: 'carol@sirina.de', role: 'Security Architect' }
];

const PORT = process.env.PORT || 3000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || '';
  const method = req.method || 'GET';

  // 1. Serve accessible HTML page for /users and /
  if (method === 'GET' && (url === '/users' || url === '/')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Users Management - Sirina International</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; background: #f8f9fa; color: #212529; }
    h1 { color: #0d6efd; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #dee2e6; }
    th { background-color: #e9ecef; }
  </style>
</head>
<body>
  <main>
    <h1>Users Management</h1>
    <p>Production user accounts and role assignments.</p>
    <table>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(u => `
          <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </main>
</body>
</html>`);
    return;
  }

  // 2. Set JSON headers for REST API routes
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // GET /api/v1/users
  if (method === 'GET' && url === '/api/v1/users') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'success', data: users }));
    return;
  }

  // GET /api/v1/users/:id
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

  // Health check endpoint
  if (method === 'GET' && url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    return;
  }

  // 404 Fallback
  res.writeHead(404);
  res.end(JSON.stringify({ status: 'error', message: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`[Server] Web application listening at http://localhost:${PORT}`);
});