# freeCodeCamp-postman-api-jwt

This is the codebase that accompanies the freeCodeCamp article on Simplifying your JWT Authentication Process with Postman Scripts.

## Requirements

- Node.js `>=22.5.x`

## How to Set Up

You do not need to install any dependencies with `npm install`. Only run the application using `npm start`. The application runs on port `8888`.

## API

Here are the API endpoints and how to use them

### Registration
Register/Create a user.

```HTTP
POST /registration
Content-Type: application/json

{
	"username": "johnny",
	"password": "password"
}
```

### Authentication/Signing In
Sign in to get authentication token

```HTTP
POST /authentication
Content-Type: application/json

{
	"username": "johhny",
	"password": "password"
}
```

### Access
Use authentication token for access

```HTTP
GET /access HTTP/1.1
Authorization: Bearer c533c164a6a2f20a0dc950e3fdbcfcffca190a1f649145a9e1e4523cc39b800b
```
