# Node.js code for sissors URL shortener

To run this project locally. Clone it and then in the root folder create a .env file and add the following variables
PORT=5000
JWT= "secret key"
MONGODB= "your mongodb URL"

Authentication
I chose to use a stateless authentication and 
Utilized the npm package JSON web token (jwt) to generate a token signed with a secret key and sent to the users browses as cookies only accessed by the server only


Cors
Since the project is decoupled from the frontend I utilized cors 

Database
For this project I chose to use the mongo dB as my preferred database and mongoose as my orm

Middle ware 
I  created a middle ware called currentUser that reads the cookies decodes it and returns an error if JWT is invalid or tamparer with and puts the current users name in the reg.user variabl
