# Mindhaven
Repository of the Mindhaven application

### Running client
npm start   

### Running server 
  node index.js
  
### Running tests in server 
  npm run test:e2e

### Auto refresh server 
  npm install --save-dev nodemon 

### Generating class diagrams 
  option+D on mac 

## Connecting the local API to an Aiven MySQL database
1. In the Aiven console download the `ca.pem` certificate for your MySQL service. Save it inside `server/certs` (for example `server/certs/aiven-ca.pem`).
2. Update `server/.env` with your service credentials: 
   ```env
   DB_HOST=<aiven-hostname>
   DB_USER=<avnadmin>
   DB_PASSWORD=<your-aiven-password>
   DB_DATABASE=<database-name>
   DB_PORT=<service-port>
   DB_SSL=true
   DB_SSL_CA_FILE=certs/aiven-ca.pem
   DB_SSL_REJECT_UNAUTHORIZED=true
   ```
   You can also provide the certificate content directly via `DB_SSL_CA_BASE64` if you cannot store files locally.
3. Start the API from the `server` directory (`node index.js`). The server will now establish an SSL connection to the remote Aiven database while still running locally.
## Running tests
npm test
npm run test:coverage      
