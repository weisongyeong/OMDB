# OMDB
OMDB is a movie web application that users may use it to view different movie information like title, raiting and their similar movies. This OMDB app is built in two main frameworks which are .Net Core 7 and and React JS. The development process is done in Visual Studio.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Support](#support)

## Getting Started

### Prerequisites
The softwares or tools that are required to run this movie application includes:
- [.NET Core 7](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/en/download/)
- [Visual Studio](https://visualstudio.microsoft.com/downloads/)
- [Postman](https://www.postman.com/downloads/)
- [SSMS](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16)
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### Installation
1. Launch the command prompt in your computer, run the following code to create the local server. (SQL Server Express required)
  >  - sqllocaldb create "CLTServer"
2. Launch SSMS, connect to the server "(localdb)\CLTServer" with Windows Authentication. When the connection is done, create a database named "MovieAppDB". In the database "MovieAppDB", run the SQL script file named 'DbScript.sql' to import all the tables. Import the table data from the CSV files in the folder "Table Data" to the corresponding tables.
3. Open the 'OMDB.sln' project solution file using Visual Studio
4. Debug and run the application using IIS Express web server

## Usage
Important features of this OMDB application can be cateogorized into authority-and-authentication features and movie-app-related features.

### Movie-app-related features
- View different movies
- Check movie' title and rating
- click movie image to view similar movies
- Search for a movie

### Authority-and-authentication features
1. Admin can do
  a. Create a new general user account
  b. Create an admin account
  c. Utilize all movie-app-related features
2. General user can do
  a. Utilize all movie-app-related features

Kindly take note that all users are required to have an account for this movie app. 

### For General User
When they run this web application, the app will first redirect the page to a login page where users can key in their username and password to login this movie application. If users don't have an account, they can register the account by clicking the "New User?' link located at the bottom of the form. Registeration form contains three main fields which are username, email and password.
  
After they finish a registration, users would be redirected back to the login page. From there, they can insert the username and password they just created and only they login to the movie app and authenticated to fully utilize the general-user features of the movie application.

### For Admin User
The first admin user account can be created by calling "register-first-admin" API GET request via Postman.
The first admin account detail is provided as follow:
  - Username = "Admin01"
  - Email = "admin01@omdb.com"
  - Password = "Admin01@omdb"
The "register-first-admin" API GET request link is provided as below:
- register-admin API : https://localhost:44376/api/Authenticate/register-first-admin

> Change the port number is you are not using IIS Express to debug and run the app

### Contraints for user account creation
- Username can be in any formats
- Email must be in a valid email format
- Password must contains 8-15 characters including
  a. At least one special characters
  b. At least one number
  c. At least one uppercase
  d. At least one lowercase

## Support
If you need any assistance with the movie application, feel free to reach out to the maintainers by opening an issue or sending an email to:
- Email: weisong0402@gmail.com
