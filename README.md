## Northcoders News API

Northcoders News API is a project built to serve an API for [Northcoders News](https://northcodersnews-drasek.herokuapp.com)

It has been deployed [here](https://northcodersnewsapi.herokuapp.com) where you can find the end points you can interact with.

## Getting started

 If you rather want to dig in, please clone this repository, execute ```npm install``` and, when is done, please make mongoDB available with ```mongod```, seed the datebase with ```node seed/seed.js``` and ```npm start``` or ```npm run dev``` (this command will run with nodemon). Now it should be available in your [localhost:3000](http://localhost:3000).
 
## Running the tests

There are tests available to run on ```npm test``` using Mocha testsuite with Chai (make sure you are running mongo!).

## Deployment

To deploy the API, make sure you have deployed first a database and set DB as an environmental variable with the datebase url.

## Built with

* Express
* Mongoose

## Author

* Alvaro Catalina - [more info](https://acatalina.github.io/portfolio)
