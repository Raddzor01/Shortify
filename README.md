# Shortify

A plugin for shortening links on Javascript using Node.js

![image](https://github.com/Raddzor01/Shortify/assets/75639391/e8254698-c5a8-4aff-b579-fab63e111415)

# Preparing the environment for working with the databasee
- Server installation for Linux, Windows, MacOS, BSD, Solaris
  - Distributions: https://www.postgresql.org/download/
  - Instructions for Fedora: https://fedoraproject.org/wiki/PostgreSQL#Installation
- Installation of PgSQL Admin
  - Distributions: https://www.pgadmin.org/download/
  - For Fedora: dnf install pgadmin3
- Create user and database
  - `su - postgres`
  - `psql` get to the PostgreSQL command line
  - `\password postgres` set user password
  - create a new user `CREATE USER raddzor WITH PASSWORD 'root'`;
  -  create database `CREATE DATABASE shortify OWNER raddzor;`
  - `\quit` exit
- Execute the file with the SQL script for creating the database
  - `sudo psql -U raddzor -d shortify -a -f db/db.sql`
- If you want to use other data to create the database, change the default data in the `db/pool-config.json` file to yours
- Install dependencies (including the pg module) `npm i`
- Run `npm start`
- Open `http://localhost:3000` to view it in your browser.
