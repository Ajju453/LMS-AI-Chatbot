// MongoDB initialization script for GitVC application
// This script runs automatically when MongoDB container starts

// Connect to the admin database
db = db.getSiblingDB('admin');

// Create the gitvc_db database
db = db.getSiblingDB('gitvc_db');

// Create git_configs collection with proper schema
db.createCollection('git_configs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'userName', 'userEmail'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'string', description: 'Unique user identifier' },
        userName: { bsonType: 'string', description: 'Git user name' },
        userEmail: { bsonType: 'string', description: 'Git user email' },
        autoCrlf: { bsonType: 'bool' },
        symlinks: { bsonType: 'bool' },
        fscache: { bsonType: 'bool' },
        longpaths: { bsonType: 'bool' },
        gitServerUrl: { bsonType: 'string' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' }
      }
    }
  }
});

// Create index on userId for faster queries
db.git_configs.createIndex({ userId: 1 }, { unique: false });
db.git_configs.createIndex({ userId: 1, createdAt: -1 });

print('✓ Created git_configs collection with indexes');

// Create ssh_keys collection
db.createCollection('ssh_keys', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'email', 'keyType'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'string' },
        email: { bsonType: 'string' },
        keyType: { bsonType: 'string', enum: ['ed25519', 'rsa'] },
        publicKey: { bsonType: 'string' },
        keyPath: { bsonType: 'string' },
        fingerprint: { bsonType: 'string' },
        isActive: { bsonType: 'bool' },
        createdAt: { bsonType: 'date' },
        expiresAt: { bsonType: ['date', 'null'] },
        lastUsed: { bsonType: ['date', 'null'] }
      }
    }
  }
});

// Create indexes on ssh_keys
db.ssh_keys.createIndex({ userId: 1 });
db.ssh_keys.createIndex({ userId: 1, email: 1 });
db.ssh_keys.createIndex({ isActive: 1 });
db.ssh_keys.createIndex({ expiresAt: 1 });

print('✓ Created ssh_keys collection with indexes');

// Create tasks collection
db.createCollection('tasks', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'title'],
      properties: {
        _id: { bsonType: 'objectId' },
        userId: { bsonType: 'string' },
        title: { bsonType: 'string' },
        description: { bsonType: ['string', 'null'] },
        completed: { bsonType: 'bool' },
        priority: { bsonType: 'string', enum: ['low', 'medium', 'high'] },
        createdAt: { bsonType: 'date' },
        completedAt: { bsonType: ['date', 'null'] },
        dueDate: { bsonType: ['date', 'null'] }
      }
    }
  }
});

// Create indexes on tasks
db.tasks.createIndex({ userId: 1 });
db.tasks.createIndex({ userId: 1, completed: 1 });
db.tasks.createIndex({ userId: 1, priority: 1 });
db.tasks.createIndex({ dueDate: 1 });

print('✓ Created tasks collection with indexes');

// Insert sample data for demonstration
db.git_configs.insertOne({
  userId: 'user123',
  userName: 'Demo User',
  userEmail: 'demo@example.com',
  autoCrlf: true,
  symlinks: false,
  fscache: true,
  longpaths: true,
  gitServerUrl: 'https://code.siemens.com',
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✓ Inserted sample git config');

db.ssh_keys.insertOne({
  userId: 'user123',
  email: 'demo@example.com',
  keyType: 'ed25519',
  publicKey: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKWVlTYWU3U2a1V5V3Y0X1Y2Z1Y3a1Y4Z1Z5Z1Y6Y1Z /home/demo/.ssh/id_ed25519.pub',
  keyPath: '/home/demo/.ssh/id_ed25519',
  fingerprint: 'SHA256:example1234567890abcdefghijklmnopqrstuvwxyz',
  isActive: true,
  createdAt: new Date(),
  expiresAt: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
  lastUsed: new Date()
});

print('✓ Inserted sample SSH key');

db.tasks.insertMany([
  {
    userId: 'user123',
    title: 'Configure Git Settings',
    description: 'Set up Git configuration with user name and email',
    completed: true,
    priority: 'high',
    createdAt: new Date(),
    completedAt: new Date(),
    dueDate: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    userId: 'user123',
    title: 'Generate SSH Keys',
    description: 'Generate ED25519 SSH keys for repository access',
    completed: true,
    priority: 'high',
    createdAt: new Date(),
    completedAt: new Date(),
    dueDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    userId: 'user123',
    title: 'Test Git Connection',
    description: 'Verify SSH connection to Siemens Git server',
    completed: false,
    priority: 'high',
    createdAt: new Date(),
    completedAt: null,
    dueDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)
  },
  {
    userId: 'user123',
    title: 'Set Up VSCode Extensions',
    description: 'Install Git extensions in VS Code',
    completed: false,
    priority: 'medium',
    createdAt: new Date(),
    completedAt: null,
    dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    userId: 'user123',
    title: 'Clone First Repository',
    description: 'Clone a test repository using Git over SSH',
    completed: false,
    priority: 'high',
    createdAt: new Date(),
    completedAt: null,
    dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
  }
]);

print('✓ Inserted sample tasks');

// Display collection statistics
var collections = db.getCollectionNames();
print('\n=== MongoDB Initialization Complete ===');
print('Created collections: ' + collections.join(', '));
print('Database: ' + db.getName());
print('Total documents: ' + 
  (db.git_configs.countDocuments() + 
   db.ssh_keys.countDocuments() + 
   db.tasks.countDocuments()));
print('=====================================\n');
