// mock-api.js - Mock API with short UUIDs, phone auth, names, JSON persistence, status codes

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock secret for JWT
const JWT_SECRET = 'mock-secret-for-testing-only';

// DB file path
const DB_PATH = path.join(__dirname, 'db.json');

// Load or initialize database
function loadDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = {
        // users: [
        //   {
        //     id: nanoid(8),
        //     phone: '+1234567890',
        //     password: 'admin123',
        //     role: 'admin',
        //     name: 'Alice',
        //     last_name: 'Adminson'
        //   },
        //   {
        //     id: nanoid(8),
        //     phone: '+0987654321',
        //     password: 'user123',
        //     role: 'user',
        //     name: 'Bob',
        //     last_name: 'Userman'
        //   },
        //   {
        //     id: nanoid(8),
        //     phone: '+1122334455',
        //     password: 'user456',
        //     role: 'user',
        //     name: 'Carol',
        //     last_name: 'Client'
        //   }
        // ],
        users: [
          { id: nanoid(8), name: 'Taha', last_name: 'Moosavi', phone: '+1234567890', password: 'admin123', role: 'admin' },
          { id: nanoid(8), name: 'Ehsan', last_name: 'Hopeful', phone: '+0987654321', password: 'user123', role: 'user' },
          { id: nanoid(8), name: 'Mobina', last_name: 'Khodabandeh', phone: '+1122334455', password: 'user456', role: 'user' },
        ],
        projects: [
          { id: nanoid(8), name: 'Project Alpha', description: 'First project', budget: 50000, owner: 1 },
          { id: nanoid(8), name: 'Project Beta', description: 'Second project', budget: 75000, owner: 2 }
        ],
        finances: [
          { id: nanoid(8), project_id: 1, amount: 25000, category: 'Development', date: '2024-01-15' },
          { id: nanoid(8), project_id: 1, amount: 15000, category: 'Marketing', date: '2024-02-01' },
          { id: nanoid(8), project_id: 2, amount: 30000, category: 'Design', date: '2024-01-20' }
        ]
      };

      // Fix references with real UUIDs
      const adminUser = initialData.users.find(u => u.phone === '+1234567890');
      const user1 = initialData.users.find(u => u.phone === '+0987654321');
      initialData.projects[0].owner = adminUser.id;
      initialData.projects[1].owner = user1.id;
      initialData.finances[0].project_id = initialData.projects[0].id;
      initialData.finances[1].project_id = initialData.projects[0].id;
      initialData.finances[2].project_id = initialData.projects[1].id;

      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load DB:', err);
    process.exit(1);
  }
}

// Save database to file
function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save DB:', err);
  }
}

// Load initial data
let db = loadDB();
let users = db.users;
let projects = db.projects;
let finances = db.finances;

// Auto-save helper
function persist() {
  saveDB({ users, projects, finances });
}

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      error: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 403,
        error: 'Invalid token'
      });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 403,
      error: 'Admin access required'
    });
  }
  next();
};

// Login endpoint — returns full user info including name/last_name
app.post('/api/login', (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);

  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Invalid credentials'
    });
  }

  // Include name & last_name in JWT payload (optional but useful)
  const token = jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      last_name: user.last_name
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({
    status: 200,
    token,
    user: {
      id: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      last_name: user.last_name
    }
  });
});

// Get current user
app.get('/api/me', authenticateToken, (req, res) => {
  res.status(200).json({
    status: 200,
    ...req.user
  });
});

// Get all users (admin only) — excludes password
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  res.status(200).json({
    status: 200,
    users: users.map(({ password, ...user }) => user)
  });
});

// Create user (admin only) — now accepts name & last_name
app.post('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const { phone, password, role, name, last_name } = req.body;
  if (!phone || !password) {
    return res.status(400).json({
      status: 400,
      error: 'Phone and password are required'
    });
  }
  const newUser = {
    id: nanoid(8),
    phone,
    password,
    role: role || 'user',
    name: name || '',
    last_name: last_name || ''
  };
  users.push(newUser);
  persist();
  res.status(201).json({
    status: 201,
    id: newUser.id,
    phone: newUser.phone,
    role: newUser.role,
    name: newUser.name,
    last_name: newUser.last_name
  });
});

// Update user (admin only) — can update name & last_name
app.put('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = req.params.id;
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      status: 404,
      error: 'User not found'
    });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };
  persist();
  res.status(200).json({
    status: 200,
    id: users[userIndex].id,
    phone: users[userIndex].phone,
    role: users[userIndex].role,
    name: users[userIndex].name,
    last_name: users[userIndex].last_name
  });
});

// Delete user (admin only)
app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = req.params.id;
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);

  if (users.length === initialLength) {
    return res.status(404).json({
      status: 404,
      error: 'User not found'
    });
  }

  persist();
  res.status(200).json({
    status: 200,
    message: 'User deleted successfully'
  });
});

// Get projects
app.get('/api/projects', authenticateToken, (req, res) => {
  res.status(200).json({
    status: 200,
    projects
  });
});

// Create project
app.post('/api/projects', authenticateToken, (req, res) => {
  const { name, description, budget } = req.body;
  const newProject = {
    id: nanoid(8),
    name,
    description,
    budget,
    owner: req.user.id
  };
  projects.push(newProject);
  persist();
  res.status(201).json({
    status: 201,
    ...newProject
  });
});

// Update project
app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const projectIndex = projects.findIndex(p => p.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({
      status: 404,
      error: 'Project not found'
    });
  }

  if (req.user.role !== 'admin' && projects[projectIndex].owner !== req.user.id) {
    return res.status(403).json({
      status: 403,
      error: 'Not authorized to edit this project'
    });
  }

  projects[projectIndex] = { ...projects[projectIndex], ...req.body };
  persist();
  res.status(200).json({
    status: 200,
    ...projects[projectIndex]
  });
});

// Delete project
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const projectIndex = projects.findIndex(p => p.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({
      status: 404,
      error: 'Project not found'
    });
  }

  if (req.user.role !== 'admin' && projects[projectIndex].owner !== req.user.id) {
    return res.status(403).json({
      status: 403,
      error: 'Not authorized to delete this project'
    });
  }

  projects = projects.filter(p => p.id !== id);
  persist();
  res.status(200).json({
    status: 200,
    message: 'Project deleted successfully'
  });
});

// Get finances
app.get('/api/finances', authenticateToken, (req, res) => {
  res.status(200).json({
    status: 200,
    finances
  });
});

// Create finance entry
app.post('/api/finances', authenticateToken, (req, res) => {
  const { project_id, amount, category, date } = req.body;
  const newFinance = {
    id: nanoid(8),
    project_id,
    amount,
    category,
    date
  };
  finances.push(newFinance);
  persist();
  res.status(201).json({
    status: 201,
    ...newFinance
  });
});

// Update finance entry
app.put('/api/finances/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const financeIndex = finances.findIndex(f => f.id === id);

  if (financeIndex === -1) {
    return res.status(404).json({
      status: 404,
      error: 'Finance entry not found'
    });
  }

  finances[financeIndex] = { ...finances[financeIndex], ...req.body };
  persist();
  res.status(200).json({
    status: 200,
    ...finances[financeIndex]
  });
});

// Delete finance entry
app.delete('/api/finances/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const initialLength = finances.length;
  finances = finances.filter(f => f.id !== id);

  if (finances.length === initialLength) {
    return res.status(404).json({
      status: 404,
      error: 'Finance entry not found'
    });
  }

  persist();
  res.status(200).json({
    status: 200,
    message: 'Finance entry deleted successfully'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Mock API with names, short UUIDs, phone auth, JSON persistence is running'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Mock API running on http://localhost:${PORT}`);
  console.log(`💾 Data persisted to: ${DB_PATH}`);
  console.log('📱 Test users (use phone to login):');
  users.forEach(u => {
    console.log(`- ${u.role}: ${u.name} ${u.last_name} (${u.phone}) | ID: ${u.id}`);
  });
});

module.exports = app;