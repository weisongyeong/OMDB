# Project Title
A brief description of the movie application.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Support](#support)

## Getting Started

### Prerequisites
The softwares or tools that are required to run this movie application includes:
- [.NET Core](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/en/download/)
- [Visual Studio](https://visualstudio.microsoft.com/downloads/)
- [Postman](https://www.postman.com/downloads/)

### Installation
1. Open the OMDB.sln project solution file using Visual Studio
2. Debug and run the application using IIS Express web server

## Usage
Important features of this OMDB application can be cateogorized into authority-and-authentication features and movie-app-related features.

### Movie-app-related features
- View different movies
- Check movie' title and rating
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
The first admin user can create an account by calling "register-admin" API via Postman with parameters "username", "email" and "password". The other admin accounts can be created by the first admin.
The "register-admin" API link is provided as below:
- register-admin API : https://localhost:44376/api/Authenticate/register-admin
> You are required to run the app to call the "register-admin" API
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

