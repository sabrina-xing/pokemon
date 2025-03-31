![image 111](https://github.com/user-attachments/assets/70e46518-782e-4468-98ba-c8552398c89b)
Welcome to PokéPals! A full-stack app where you can collect, gift, and gamble for Pokémon cards, search and filter collections, and personalize your dashboard to showcase your favorites.

## Features
- User profile creation with signup and login authentication
- Filtering and searching for pokemon cards, through other people's cards (in `/dashboard` page) and through the user's cards as well
- Gifting and requesting Pokemon cards to/from other users

----------------------------------

The final and most up to date code for the application structure will be kept in two folders: client (frontend) and server (backend).

Tech Stack: Python (Flask), Next.js, Typescript, MySQL
## Getting Started

### Prerequisites
Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
- [Python](https://www.python.org/) and [pip](https://pip.pypa.io/en/stable/) installed for the backend.

**1. Create and setup database**
1. install mysql (https://dev.mysql.com/downloads/installer/)
2. install mysql (https://dev.mysql.com/downloads/shell/)
3. for MacOS use Homebrew
   - `brew install mysql`
4. `pip install mysql-connector-python`
5. Create a new DB using mysql
   - Open command line or mysql shell
   - Open MySQL Shell: `mysql -u root -p`
   - `CREATE DATABASE [your database name]`
   - `use [your database name]`

**Populate database**

6. Replace `user`, `passwd`, and `database` with your username, password, and database name in the popu
   ```python
   db = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="[your MySQL password here]",
    database="[your db name here]"
   )
   ```
7. Run the data population script. This will create the needed tables in the database as well as populate the
   tables with data from the csvs.
   `python3 populate.py`
   If it works, the output in the terminal should be all Pikachus in the deck :> 


**2. Setting up `/server` folder:**
- Navigate to `/server` folder and create `/server/.env`, replacing each value below with your MySQL configuration:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password  # Change this to your MySQL password
DB_NAME=pokepals  # Change this to your database name
DB_PORT=3306  # Default MySQL port
```
- Create files `/client/lib/db.ts` and `/client/src/app/lib/db.ts` and add your MySQL password:
```
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pokepals",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
```


**3. Setting up `/client` folder:**
- Run:
```
npm install
```
- Set environment variables:
  - Navigate to `/client` folder and run `openssl rand -base64 32` in your terminal to generate a secure 32-character key
  - Create `/client/.env.local` file and add:
    ```
    NEXTAUTH_SECRET=<Generated Next auth key here>
    ```


## Starting the server

_(127.0.0.1:5000 by default)_

1. `cd server`
2. Create a virtual environment: `python3 -m venv venv`
3. Activate your virtual environment:
   - `source venv/bin/activate` (MacOS)
   - `venv\Scripts\activate` (Windows Powershell)
6. Install requirements: `pip install -r requirements.txt`
7. `python3 app.py`

### Starting the app

_(localhost:3000 by default)_

1. `cd client`
2. `npm install`
3. `npm start`

## Interface Design 
![image](https://github.com/user-attachments/assets/dc6d18e0-0911-47bf-af8f-e29c8cd39df8)
![image](https://github.com/user-attachments/assets/d8b30a77-243d-4ece-a0a6-ca418f35d2ca)
![image](https://github.com/user-attachments/assets/8cbe83c1-a835-426a-97d2-b53a3a60c06f)
![image](https://github.com/user-attachments/assets/8f15fc83-1772-4cc3-adcc-03d883b4d1c2)
![image](https://github.com/user-attachments/assets/f44dcb2f-05f8-4605-a598-d3545f567888)
![image](https://github.com/user-attachments/assets/7011bb48-d02e-49ac-84c6-444aa5c66ad0)
