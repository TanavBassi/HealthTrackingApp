import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};
