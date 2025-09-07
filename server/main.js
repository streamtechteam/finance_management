// mock-api.js - Minimal mock API for test environment

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock secret for JWT
const JWT_SECRET = 'mock-secret-for-testing-only';

// Mock data
let users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user1', password: 'user123', role: 'user' },
  { id: 3, username: 'user2', password: 'user456', role: 'user' }
];

let projects = [
  { id: 1, name: 'Project Alpha', description: 'First project', budget: 50000, owner: 1 },
  { id: 2, name: 'Project Beta', description: 'Second project', budget: 75000, owner: 2 }
];

let finances = [
  { id: 1, project_id: 1, amount: 25000, category: 'Development', date: '2024-01-15' },
  { id: 2, project_id: 1, amount: 15000, category: 'Marketing', date: '2024-02-01' },
  { id: 3, project_id: 2, amount: 30000, category: 'Design', date: '2024-01-20' }
];

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role }
  });
});

// Get current user
app.get('/api/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  res.json(users.map(({ password, ...user }) => user));
});

// Create user (admin only)
app.post('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const { username, password, role } = req.body;
  const newUser = {
    id: users.length + 1,
    username,
    password,
    role: role || 'user'
  };
  users.push(newUser);
  res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role });
});

// Update user (admin only)
app.put('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json({ id: users[userIndex].id, username: users[userIndex].username, role: users[userIndex].role });
});

// Delete user (admin only)
app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);
  
  if (users.length === initialLength) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ message: 'User deleted successfully' });
});

// Get projects
app.get('/api/projects', authenticateToken, (req, res) => {
  res.json(projects);
});

// Create project
app.post('/api/projects', authenticateToken, (req, res) => {
  const { name, description, budget } = req.body;
  const newProject = {
    id: projects.length + 1,
    name,
    description,
    budget,
    owner: req.user.id
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

// Update project (admin can edit any, user can only edit their own)
app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Check if user is admin or owner of the project
  if (req.user.role !== 'admin' && projects[projectIndex].owner !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to edit this project' });
  }

  projects[projectIndex] = { ...projects[projectIndex], ...req.body };
  res.json(projects[projectIndex]);
});

// Delete project (admin can delete any, user can only delete their own)
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const projectIndex = projects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  // Check if user is admin or owner of the project
  if (req.user.role !== 'admin' && projects[projectIndex].owner !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to delete this project' });
  }

  projects = projects.filter(p => p.id !== id);
  res.json({ message: 'Project deleted successfully' });
});

// Get finances
app.get('/api/finances', authenticateToken, (req, res) => {
  res.json(finances);
});

// Create finance entry
app.post('/api/finances', authenticateToken, (req, res) => {
  const { project_id, amount, category, date } = req.body;
  const newFinance = {
    id: finances.length + 1,
    project_id,
    amount,
    category,
    date
  };
  finances.push(newFinance);
  res.status(201).json(newFinance);
});

// Update finance entry (admin can edit any)
app.put('/api/finances/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const financeIndex = finances.findIndex(f => f.id === id);
  
  if (financeIndex === -1) {
    return res.status(404).json({ error: 'Finance entry not found' });
  }

  finances[financeIndex] = { ...finances[financeIndex], ...req.body };
  res.json(finances[financeIndex]);
});

// Delete finance entry (admin can delete any)
app.delete('/api/finances/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = finances.length;
  finances = finances.filter(f => f.id !== id);
  
  if (finances.length === initialLength) {
    return res.status(404).json({ error: 'Finance entry not found' });
  }
  
  res.json({ message: 'Finance entry deleted successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock API is running' });
});

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
  console.log('Test users:');
  console.log('- Admin: username: admin, password: admin123');
  console.log('- User: username: user1, password: user123');
});

module.exports = app;