# Ph-University-Server

A server for university management

## Run Locally

Clone the project

```bash
  git clone https://github.com/A1-mamun/ph-university-server.git
```

Go to the project directory

```bash
  cd ph-university-server
```

Install dependencies

```bash
  npm install
```

Create a `.env` file in your root directory and add the following to connect with mongoDB
`make sure to replace your own db_username and db_password`

```bash
PORT=5000    // you can use your suitable port
DATABASE_URL=mongodb+srv://<db_username>:<db_password>@cluster0.xrf0qev.mongodb.net/ph-university-DB?retryWrites=true&w=majority&appName=Cluster0
```

Start the server

```bash
  npm run start:dev
```
