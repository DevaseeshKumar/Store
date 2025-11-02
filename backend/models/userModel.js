// models/userModel.js
export const createUserSql = `
  INSERT INTO users (name, email, password) VALUES (?, ?, ?)
`;

export const getUserByEmailSql = `
  SELECT * FROM users WHERE email = ?
`;

export const getUserByIdSql = `
  SELECT id, name, email, created_at FROM users WHERE id = ?
`;
