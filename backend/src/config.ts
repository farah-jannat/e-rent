export const config = {
  get DATABASE_URL() {
    return process.env.DATABASE_URL || "";
  },

  get CLIENT_URL() {
    return process.env.CLIENT_URL || "";
  },

  get SECRET_KEY_ONE() {
    return process.env.SECRET_KEY || "";
  },

  get JWT_TOKEN() {
    return process.env.JWT_TOKEN || "";
  },
};
