import bcrypt from 'bcrypt';

export interface IMockUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'client';
}

const mockUsers: IMockUser[] = [];

// Seed default users for instant testing
export const seedMockUsers = async () => {
  if (mockUsers.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('admin123', salt);
    const clientHash = await bcrypt.hash('client123', salt);
    
    mockUsers.push({
      _id: 'mock-admin-id',
      name: 'Origenix Admin',
      email: 'admin@origenix.com',
      passwordHash: adminHash,
      role: 'admin',
    });
    
    mockUsers.push({
      _id: 'mock-client-id',
      name: 'Acme Corp Client',
      email: 'client@origenix.com',
      passwordHash: clientHash,
      role: 'client',
    });
    
    console.log('Seeded in-memory mock users successfully:');
    console.log('  Admin: admin@origenix.com / admin123');
    console.log('  Client: client@origenix.com / client123');
  }
};

// Seed immediately on startup
seedMockUsers();

export const mockUserFindOne = async (query: { email?: string }) => {
  await seedMockUsers();
  return mockUsers.find(u => u.email === query.email) || null;
};

export const mockUserCreate = async (data: { name: string; email: string; password?: string; role?: 'admin' | 'client' }) => {
  await seedMockUsers();
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password || 'password123', salt);
  const newUser: IMockUser = {
    _id: 'mock-id-' + Math.random().toString(36).substring(2, 11),
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role || 'client',
  };
  mockUsers.push(newUser);
  return newUser;
};

export const mockUserFindById = async (id: string) => {
  await seedMockUsers();
  return mockUsers.find(u => u._id === id) || null;
};

export const mockUserFindByIdAndUpdate = async (id: string, updates: any) => {
  await seedMockUsers();
  const user = mockUsers.find(u => u._id === id);
  if (!user) return null;
  if (updates.name) user.name = updates.name;
  if (updates.email) user.email = updates.email;
  if (updates.password) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(updates.password, salt);
  }
  return user;
};

// --- In-Memory Inquiries & Projects ---

export interface IMockInquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface IMockProject {
  _id: string;
  title: string;
  clientEmail: string;
  status: string;
  progress: number;
}

const mockInquiries: IMockInquiry[] = [
  {
    _id: 'mock-inquiry-1',
    name: 'Sravan Test',
    email: 'sravan@origenix.com',
    message: 'Welcome to Origenix! This is a seeded system inquiry to show the database flow is active.',
    createdAt: new Date(),
  }
];

const mockProjects: IMockProject[] = []; // Starting completely clean at 0 projects as requested

export const mockInquiryCreate = async (data: { name: string; email: string; message: string }) => {
  const newInquiry: IMockInquiry = {
    _id: 'mock-inquiry-' + Math.random().toString(36).substring(2, 11),
    name: data.name,
    email: data.email,
    message: data.message,
    createdAt: new Date(),
  };
  mockInquiries.push(newInquiry);
  return newInquiry;
};

export const mockInquiryFindAll = async () => {
  return mockInquiries;
};

export const mockProjectFindAllByClientEmail = async (email: string) => {
  return mockProjects.filter(p => p.clientEmail === email);
};

export const mockUserCount = async () => {
  await seedMockUsers();
  return mockUsers.length;
};

export const mockInquiryCount = async () => {
  return mockInquiries.length;
};

export const mockProjectCount = async () => {
  return mockProjects.length;
};

// --- Telemetry & Client Support Ticketing System ---

export interface IMockVisit {
  _id: string;
  path: string;
  browser: string;
  device: 'Desktop' | 'Mobile';
  userId?: string;
  userName?: string;
  createdAt: Date;
}

export interface IMockQuery {
  _id: string;
  clientName: string;
  clientEmail: string;
  title: string;
  description: string;
  status: 'open' | 'resolved';
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMockSearchLog {
  _id: string;
  query: string;
  userId?: string;
  userName?: string;
  createdAt: Date;
}

const mockVisits: IMockVisit[] = [
  {
    _id: 'mock-visit-1',
    path: '/',
    browser: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    device: 'Desktop',
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
  },
  {
    _id: 'mock-visit-2',
    path: '/research',
    browser: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    device: 'Mobile',
    createdAt: new Date(Date.now() - 1800000), // 30 mins ago
  }
];

const mockQueries: IMockQuery[] = [
  {
    _id: 'mock-query-1',
    clientName: 'Acme Corp Client',
    clientEmail: 'client@origenix.com',
    title: 'How can we integrate dynamic Web3 authentication?',
    description: 'We are looking to implement a premium user verification mechanism in our client panel using ERC-4337 or standard zero-knowledge proofs. Please advise.',
    status: 'open',
    createdAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 4),
  }
];

const mockSearchLogs: IMockSearchLog[] = [
  {
    _id: 'mock-search-1',
    query: 'conceptual architecture support agent',
    createdAt: new Date(Date.now() - 3600000 * 3), // 3 hours ago
  }
];

export const mockVisitCreate = async (data: { path: string; browser: string; device: 'Desktop' | 'Mobile'; userId?: string; userName?: string }) => {
  const newVisit: IMockVisit = {
    _id: 'mock-visit-' + Math.random().toString(36).substring(2, 11),
    path: data.path,
    browser: data.browser,
    device: data.device,
    userId: data.userId,
    userName: data.userName,
    createdAt: new Date(),
  };
  mockVisits.push(newVisit);
  return newVisit;
};

export const mockVisitFindAll = async () => {
  return mockVisits;
};

export const mockVisitCount = async () => {
  return mockVisits.length;
};

export const mockQueryCreate = async (data: { clientName: string; clientEmail: string; title: string; description: string }) => {
  const newQuery: IMockQuery = {
    _id: 'mock-query-' + Math.random().toString(36).substring(2, 11),
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    title: data.title,
    description: data.description,
    status: 'open',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockQueries.push(newQuery);
  return newQuery;
};

export const mockQueryFindAll = async () => {
  return mockQueries;
};

export const mockQueryFindAllByClientEmail = async (email: string) => {
  return mockQueries.filter(q => q.clientEmail === email);
};

export const mockQueryFindByIdAndResolve = async (id: string, response: string) => {
  const query = mockQueries.find(q => q._id === id);
  if (!query) return null;
  query.status = 'resolved';
  query.response = response;
  query.updatedAt = new Date();
  return query;
};

export const mockSearchLogCreate = async (data: { query: string; userId?: string; userName?: string }) => {
  const newSearch: IMockSearchLog = {
    _id: 'mock-search-' + Math.random().toString(36).substring(2, 11),
    query: data.query,
    userId: data.userId,
    userName: data.userName,
    createdAt: new Date(),
  };
  mockSearchLogs.push(newSearch);
  return newSearch;
};

export const mockSearchLogFindAll = async () => {
  return mockSearchLogs;
};

export const mockSearchLogCount = async () => {
  return mockSearchLogs.length;
};

