# pokemon

CS 348 Group Project


TO DO:
- describe how to create and load your sample database to your chosen platform
- how to run your working database-driven application
- what feature it currently supports.


----------------------------------

The final and most up to date code for the application structure will be kept in two folders: client (frontend) and server (backend).

## Getting Started

### Prerequisites
1. Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
- [Python](https://www.python.org/) and [pip](https://pip.pypa.io/en/stable/) installed for the backend.

2. Install required dependencies in root folder and both frontend and backend folders
```
npm install
```

### Starting the server

_(127.0.0.1:5000 by default)_

1. `cd server`
2. `python3 -m venv venv`
3. `source venv/bin/activate` (MacOS)
4. `venv\Scripts\activate` (Windows Powershell)
5. `pip install -r requirements.txt`
6. `python3 app.py`

### Starting the app

_(localhost:3000 by default)_

1. `cd client`
2. `npm install`
3. `npm start`

### Interface Design 

![login page](https://github.com/user-attachments/assets/185bc91b-79b8-4135-bcba-e47062851152)
![trade pokemons page](https://github.com/user-attachments/assets/c96bde6d-cb7a-46a3-90ee-56c50fb64b9f)
![upload new card page](https://github.com/user-attachments/assets/42a020ee-08bf-43b9-9e91-e6ff4d3cdaae)

### Backend
## Create DB
1. install mysql (https://dev.mysql.com/downloads/installer/)
2. install mysql (https://dev.mysql.com/downloads/shell/)
3. for MacOS use Homebrew
   - `brew install mysql`
4. `pip install mysql-connector-python`
5. Create a new db using mysql
   - Open command line or mysql shell
   - `mysql -u root -p`
   - `CREATE DATABASE [your database name]`
6. Replace `user`, `passwd`, and `database` with your username, password, and database name
   ```python
   db = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="",
    database="testdatabase"
   )
   ```
