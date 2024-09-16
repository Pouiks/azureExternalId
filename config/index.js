require('dotenv').config();

module.exports = {
  defaultConfig: {
    clientId: process.env.DEFAULT_CLIENT_ID,
    clientSecret: process.env.DEFAULT_CLIENT_SECRET,
    tenantId: process.env.DEFAULT_TENANT_ID,
    scope: process.env.DEFAULT_SCOPE,
  },
  anotherConfig: {
    clientId: process.env.ANOTHER_CLIENT_ID,
    clientSecret: process.env.ANOTHER_CLIENT_SECRET,
    tenantId: process.env.ANOTHER_TENANT_ID,
    scope: process.env.ANOTHER_SCOPE,
  },
};
