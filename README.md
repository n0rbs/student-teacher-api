# School system

**API running in the Cloud**

Please request from the developer the link to the API endpoints

### Install and configure

**Running the services locally**

Please install `node` in your local machine. A miniumum version of `v10.16.0` is required to run this application without issues. You can install `nodemon` globally for development purposes. You can use `nvm` (Node Version Manager) to install the required version of `node` and the corresponding `npm` client.

```bash
nvm install 10.16.0
# Verify verion in use
node -v
# Optional
# npm i -g nodemon
```

* **API**

  Download the API repository, `student-teacher-api`, from Github and install the application dependencies by running `npm install`
  ```bash
  git clone git@github.com:n0rbs/student-teacher-api.git
  cd student-teacher-api

  npm install
  ```

  Create the `.env` file and add the required environment variables. The database credentials will be parsed from the environment variables.

  ```
  DEBUG=true
  
  # API Port
  PORT=8008
  
  # Database configuration
  DB_PASSWORD=norbert

  # Please check ./config/development.json for the other configuration
  ```

* **Database**

  **BEFORE YOU PROCEED**: You need to have `docker` installed locally to execute the next set of instructions. If you don't have `docker`, please go directly to **Compose MySQL (DBAAS)**

  **Docker** - Let's generate a docker container instance of the latest `mysql` image. Please invoke the commands below to setup your local MySQL database. 
  
  *Warning*: If port `3306` is already taken please modify the docker host port in the `docker run` command, inside `run-local.sh`, and change the value of `PORT` in `.env`.
  ```bash
  cd scripts

  # You must have docker to run the MySQL docker container
  ./run-local.sh <YOUR_MYSQL_PASSWORD>

  # Wait for a few minutes until the mysql has fully started then invoke the docker command below
  docker exec dbsvc-school /bin/sh -c "mysql -u root -p<YOUR_MYSQL_PASSWORD> < /db.sql"
  ```

  **Compose MySQL (DBAAS)** - The remote API is currently using a MySQL instance hosted in the Cloud. You need request for the DB service instance and certificate to access the remote database. Finally, you need to modify your DB environment variables in `.env`.

  ```
  DEBUG=true
  
  # Port to access the API
  PORT=8001
  
  # Database configuration
  DB_PASSWORD=xxxxxx

  # The base64 string certifcate of the remote MySQL service
  CA_CERT=LS0xxxxxx
  
  # Please check ./config/production.json for the other configuration
  ```
  **Note**: Please request these credentials from the developer if you don't have docker installed locally or you're having problems setting up docker.


### Test

Running the unit test
```bash
npm test
# Generate code coverage
npm run test-wc
```

### Running locally

**Development** - Accessing the local MySQL docker instance

Running the API in development mode will connect to the local MySQL database. Please ensure the database is running.
```bash
# Development
NODE_ENV=development nodemon server.js
# or
# npm run dev
```

**Production** - Accessing the remote database

If you invoke `npm start`, this will use the production configuration and will require the remote MySQL credentials.

```bash
# Run the API locally and accessing the remote server
npm start
```

### End-to-end deployment

Here's the tech stack for the "coding to deployment" project development

* **GitHub** - The choice of source control service
* **NodeJS** - ExpressJS with swagger routes express was the choice backend libraries to build the RESTful API.
* **Swagger** - Using swagger to define my API endpoints
* **Cloud** - Using DigitalOcean as my Cloud provider. All remote services are hosted here except for the remote Compose MySQL instance which is hosted in IBM Cloud.
* **Kubernetes** - I created the k8s deployment and service resources to deploy the NodeJS API. I modified the nginx ingress controller to accept the new endpoints, ie. `/api/register`

* **Compose MySQL** - Provisioned a MySQL 5.7.29 service in IBM Cloud as the remote database for the remote API application. The remote service requires a certificate for it to be accessible remotely.

* **CI/CD with GitHub Actions** - Leveraging GitHub Actions to run the unit test, package the docker image, publish the docker image to Docker Hub, deploy the application to DigitalOcean's k8s cluster and verification.

* **Container Registry** - I chose Docker hub as the container registry as. The image, `norbertdp/cdp-student-teacherapi`, is under my account `norbertdp`

* **Postman** - Generate the exported Postman API endpoints