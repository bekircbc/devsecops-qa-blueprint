// Example user module for static analysis & security linting
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'qa';
}

export const mockUsers: User[] = [
  { id: 1, name: 'Senior DevSecOps Engineer', email: 'devsecops@sirina.de', role: 'admin' },
  { id: 2, name: 'QA Engineer', email: 'qa@sirina.de', role: 'qa' },
];

export function getUserById(id: number): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

export function sanitizeUserInput(input: string): string {
  // Simple input sanitization example to pass security rules
  return input.trim().replace(/[<>]/g, '');
}