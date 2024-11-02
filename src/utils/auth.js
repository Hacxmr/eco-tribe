// Utility functions for authentication
export const validateCredentials = (username, password) => {
  if (!username || username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
};

export const sanitizeUserData = (user) => {
  // Remove sensitive data before sending to client
  const { password, ...safeUser } = user;
  return safeUser;
}; 