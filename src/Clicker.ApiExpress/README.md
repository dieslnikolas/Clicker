# Build a REST API with Node.js, Mongoose & TypeScript

Note: This repository includes the [postman collection for the finished API](postman_collection.json)

Note 2: Make sure you add .env to your .gitignore before pushing any changes to your repository. You will also want to generate new public & private keys

#### Generate new keys: https://travistidwell.com/jsencrypt/demo/

#### Base64 encode the keys: https://www.base64encode.org/



## Common issues
* I'm getting a JWT malformed error: https://youtu.be/FzKrfwplips
* Managing environment variables: https://youtu.be/gfyQzeBlLTI

## Who is this tutorial for?
* Junior to mid-level developers
* Anyone interested in building REST APIs with TypeScript

## What you will need
* A running instance of MongoDB
* Postman
* An IDE or text editor (VS Code)
* A web browser
* A package manager such as NPM or Yarn
* Node.js installed

## What next?
* Testing the API with Jest
* Build a React.js user interface
* Add Prometheus metrics to the API
* Deploy the API with Caddy & Docker
* Add Google OAuth

## Concepts
* REST API principals
    * CRUD
    * HTTP methods
* JWT & refresh tokens
* Request validation
## Technologies
* Node.js
* MongoDB with Mongoose
* TypeScript
* Express.js & Express.js middleware
* Zod validation

## Video structure
1. What are we going to build (Postman demo)
2. Code walk-through
3. Bootstrap application
   1. Setup express JS
   2. Create routes function
   3. Setup database connection
   4. Setup logger
   5. Validate request middleware
4. Registration
   1. Create user model
   2. Create user endpoint
   3. Create user session
   4. Deserialize user middleware (refresh tokens)
   5. Get sessions
   6. Delete session
   7. Require user middleware
5. Product resource
   1. Create product model
   2. Create product
   3. Read product
   4. Update product
   5. Delete product


## Data flow
![](./diagrams/data-flow.png)


## Access & refresh token flow
![](./diagrams/refresh-token-flow.png)


# Deployment

## What will we use
* Docker (image)
* docker-compose (container)
* Caddy - Web server
* DigitalOcean

Note: You will need Docker installed locally if you want to test your Docker configutation

## Let's keep in touch
- [Subscribe on YouTube](https://www.youtube.com/TomDoesTech)
- [Discord](https://discord.gg/4ae2Esm6P7)
- [Twitter](https://twitter.com/tomdoes_tech)
- [TikTok](https://www.tiktok.com/@tomdoestech)
- [Facebook](https://www.facebook.com/tomdoestech)
- [Instagram](https://www.instagram.com/tomdoestech)

[Buy me a Coffee](https://www.buymeacoffee.com/tomn)

[Sign up to DigitalOcean 💖](https://m.do.co/c/1b74cb8c56f4)



# Express Template

This project is intended to be used as a boilerplate for creating Express API's or backend applications. The code is written in Typescript and uses and an opinionated, object oriented approach to development. It comes with features to interact with MongoDB using Mongoose. 

To get started run:
```bash
npm install
npm run build
npm run start:dev
```

## Files and Folders
---

### environment/

Complete the necessary parameters for your project. You must fill in the `db` section if using MongoDB. Files will be replaced depending on wether you run `npm run start:dev` or `npm run start:prod`.

---

### server.ts

Entry point for NodeJS to run the Express application. Use this file to create an App instance, connect to database and get the app to listn on provided port number. 

---

### middleware.ts

Use this file to build an array of middleware to be used at the app level (implemented with all routes) of your express application.

---
### routes/

Create a router file based on the template for each grouping of routes in your application. Add the exported express router to the array in the app instance object in the `server.ts` file

---
### controllers/

Create controller files for each grouping of functions the application performs. A good start would be a controller for each model in the database. 

#### base.controller.ts

This is an extendable class that expects you to use Mongoose/MongoDB and construct the models/schemas in the format used in the models folder. This base class provides commonly used CRUD functions for a very quick solution to developing CRUD APIs.

#### controllers.module.ts
Create instances of your controllers here, and you can then use it for simple imports of controllers into the routers

---

### models/

Create a model file for each model in your database. Use the `BaseModel` class to provide reusable CRUD funcitonality to each model to help stay DRY.


