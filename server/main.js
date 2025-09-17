
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

// Helper: Validate input data
function validate(schema, data) {
  const errors = [];

  for (let field in schema) {
    const rules = schema[field];
    let value = data[field];
    try{
      // if(isValidDateOrString(value)){
      //   // console.log(value)
      //   value = new Date(value);
      //   value = `${value.getFullYear()}-${(value.getMonth()+1).toString().padStart(2, '0')}-${value.getDate().toString().padStart(2, '0')}`
      //   console.log(value)
      // }
      if (value.match(/^[0-9]+$/g)){
        value = parseInt(value);
      }
    }
    catch(e){
    }

    // Required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip further checks if not required and not provided
    if (value === undefined || value === null) continue;

    // Type check
    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be a ${rules.type}`);
      continue;
    }

    // Custom validator
    if (rules.validate && !rules.validate(value)) {
      
      errors.push(rules.message || `${field} is invalid`);
    }

    // Min/Max for numbers
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`${field} must be >= ${rules.min}`);
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`${field} must be <= ${rules.max}`);
      }
    }

    // String length
    if (typeof value === 'string') {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
      }
    }
  }
  console.log(errors)
  return errors.length > 0 ? errors : null;
}

function isValidDateOrString(value) {
  if (value instanceof Date) {
    return !isNaN(value);
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return !isNaN(date.getTime()) && value === date.toISOString().slice(0, value.length);
    // Optional: stricter string format matching
  }
  return false;
}


// Load or initialize database
function loadDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = {
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

// Middleware to verify JWT + validate user still exists
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      error: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: 403,
        error: 'Invalid token'
      });
    }

    // ✅ Security Fix: Check if user still exists in database
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(403).json({
        status: 403,
        error: 'User not found or deleted'
      });
    }

    // Attach full user object to request (excluding password)
    req.user = {
      id: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
      last_name: user.last_name
    };

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
  const schema = {
    phone: { required: true, type: 'string', minLength: 5, maxLength: 20 },
    password: { required: true, type: 'string', minLength: 3 }
  };

  const errors = validate(schema, req.body);
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: 'Validation failed',
      details: errors
    });
  }

  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone && u.password === password);

  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Invalid credentials'
    });
  }

  // Include name & last_name in JWT payload
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

// Get all users (admin only)
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  res.status(200).json({
    status: 200,
    data: users.map(({ ...user }) => user) // exclude password
  });
});

// Create user (admin only)
app.post('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const schema = {
    phone: {
      required: true,
      type: 'string',
      minLength: 5,
      validate: (v) => /^[\+\d\-\s\(\)]+$/.test(v),
      message: 'phone must be a valid phone number format'
    },
    password: { required: true, type: 'string', minLength: 6 },
    name: { required: true, type: 'string', minLength: 1, maxLength: 50 },
    last_name: { required: true, type: 'string', minLength: 1, maxLength: 50 },
    role: {
      required: true,
      type: 'string',
      validate: (v) => ['admin', 'user'].includes(v),
      message: 'role must be "admin" or "user"'
    }
  };

  const errors = validate(schema, req.body);
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: 'Validation failed',
      details: errors
    });
  }

  const { phone, password, name, last_name, role } = req.body;
  const newUser = {
    id: nanoid(8),
    phone,
    password,
    name,
    last_name,
    role
  };

  users.push(newUser);
  persist();

  // Return without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    status: 201,
    ...userWithoutPassword
  });
});

// Update user (admin only)
app.put('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = req.params.id;
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      status: 404,
      error: 'User not found'
    });
  }

  // Define partial update schema
  const schema = {
    phone: {
      type: 'string',
      minLength: 5,
      validate: (v) => /^[\+\d\-\s\(\)]+$/.test(v),
      message: 'phone must be a valid phone number format'
    },
    password: { type: 'string', minLength: 6 },
    name: { type: 'string', minLength: 1, maxLength: 50 },
    last_name: { type: 'string', minLength: 1, maxLength: 50 },
    role: {
      type: 'string',
      validate: (v) => ['admin', 'user'].includes(v),
      message: 'role must be "admin" or "user"'
    }
  };

  const errors = validate(schema, req.body);
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: 'Validation failed',
      details: errors
    });
  }

  // Prevent updating ID or other sensitive fields
  const { id: _id, ...allowedFields } = req.body;
  users[userIndex] = { ...users[userIndex], ...allowedFields };
  persist();

  const { password: __, ...userWithoutPassword } = users[userIndex];
  res.status(200).json({
    status: 200,
    ...userWithoutPassword
  });
});

// Delete user (admin only) - cannot delete self
app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const id = req.params.id;

  if (req.user.id === id) {
    return res.status(400).json({
      status: 400,
      error: 'You cannot delete yourself'
    });
  }

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
    data: projects
  });
});

// Create project
app.post('/api/projects', authenticateToken, (req, res) => {
  console.log(req.body)
  const schema = {
    name: { required: true, type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string', maxLength: 500 },
    budget: { required: true, type: 'number', min: 0, max: 999999999 }
  };

  const errors = validate(schema, req.body);
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: 'Validation failed',
      details: errors
    });
  }

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

  const schema = {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string', maxLength: 500 },
    budget: { type: 'number', min: 0, max: 999999999 }
  };

  const errors = validate(schema, req.body);
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: 'Validation failed',
      details: errors
    });
  }

  // Prevent updating ID or owner
  const { id: _id, owner: _owner, ...allowedFields } = req.body;
  projects[projectIndex] = { ...projects[projectIndex], ...allowedFields };
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
    data: finances
  });
});

// Create finance entry
app.post('/api/finances', authenticateToken, (req, res) => {
  const schema = {
    project_id: { required: true, type: 'string', minLength: 6, maxLength: 12 },
    amount: { required: true, type: 'number', min: 0.01, max: 999999999 },
    category: { required: true, type: 'string', minLength: 1, maxLength: 50 },
    date: {
      required: true,
      type: 'string',
      validate: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v),
      message: 'date must be in YYYY-MM-DD format'
    }
  };

  const errors = validate(schema, req.body);
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: 'Validation failed',
      details: errors
    });
  }

  const { project_id, amount, category, date } = req.body;

  // Check if project exists
  const projectExists = projects.some(p => p.id === project_id);
  if (!projectExists) {
    return res.status(400).json({
      status: 400,
      error: 'Referenced project_id does not exist'
    });
  }

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
  console.log(req.body)
  const id = req.params.id;
  const financeIndex = finances.findIndex(f => f.id === id);

  if (financeIndex === -1) {
    return res.status(404).json({
      status: 404,
      error: 'Finance entry not found'
    });
  }

  const schema = {
    project_id: { type: 'string', minLength: 6, maxLength: 12 },
    amount: { type: 'number', min: 0.01, max: 999999999 },
    category: { type: 'string', minLength: 1, maxLength: 50 },
    date: {
      type: 'string',
      validate: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v),
      message: 'date must be in YYYY-MM-DD format'
    }
  };

  const errors = validate(schema, req.body);
  console.log(errors)
  if (errors) {
    return res.status(400).json({
      status: 400,
      error: 'Validation failed',
      details: errors
    });
  }

  // Validate project_id if being changed
  if (req.body.project_id) {
    const projectExists = projects.some(p => p.id === req.body.project_id);
    if (!projectExists) {
      return res.status(404).json({
        status: 404,
        error: 'Referenced project_id does not exist'
      });
    }
  }

  // Prevent updating ID
  const { id: _id, ...allowedFields } = req.body;
  finances[financeIndex] = { ...finances[financeIndex], ...allowedFields };
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
    message: '✅ Mock API with validation, security, names, short UUIDs, phone auth, and JSON persistence is running'
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