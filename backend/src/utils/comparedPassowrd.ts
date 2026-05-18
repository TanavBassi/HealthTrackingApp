/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as bcrypt from 'bcrypt';

export const comparedPassword = async (
  password: string,
  hashedPassword: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return bcrypt.compare(password, hashedPassword);
};
