# Gift-Token-Generator-And-Redeemer
You can use this API to generate required number of unique tokens for the clients and also redeem them. The API used NanoID as tokens, which takes less space in the storage as compared to UUID. 
___
* ## Requirements
* #### [Node v14.20.0](https://www.stewright.me/2021/03/install-nodejs-14-on-ubuntu-20-04/)
* #### [PostgreSQL](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-22-04-quickstart)
* #### [Sequelize ORM](https://sequelize.org/docs/v6/getting-started/)
* #### [Sequelize CLI](https://www.npmjs.com/package/sequelize-cli)

_Optional: If you are testing/exploring the API then you can use Postman to hit the API_ 
* #### [Postman](https://www.postman.com/downloads/)
___
## Working
The API has 3 endpoints for the client:
  - [POST] /api/generate_tokens
  - [POST] /api/redeem_token
  - [GET] /api/get_tokens
There are another 2 endpoints for the developer:
  - [GET] /api/dev/display_data
  - [DELETE] /api/dev/delete_all_data

* ### Generate Tokens
To generate tokens, first hit the "generate_tokens" endpoint. The request's body should contain a JSON object with "clientName", "numberOfTokensRequired", "lengthOfTokens" and "validityDate" as keys and your requirements as the values. <br>
Example: <br>
```json
{
  "clientName": "Google", 
  "numberOfTokensRequired" : 10000, 
  "lengthOfTokens": 12,
  "validityDate": "20-10-2023"
}
```
As a result of this request, the server generates the required number of tokens and stores them in the database. The client receives a JSON object containing the status of request.

* ### Get Tokens
To get the tokens from the server, hit the "get_tokens" endpoint. The request's body should contain a JSON object with "clientName" and "numOfTokensRequired" as keys and your requirements as the values. <br>
Example: <br>
```json
{
  "clientName": "Google", 
  "numberOfTokensRequired" : 10000
}
```
As a result of this request, the server returns a JSON object containing the required number of tokens.

* ### Redeem Tokens
To redeem a token, hit the "redeem_token" endpoint. The request's body should contain a JSON object with "tokenValue" as key and the token as the value. <br>
Example: <br>
```json
{
  "tokenValue": "aljs3l3l1sa"
}
```
As a result of this request, the server returns a JSON object containing the status of request. This status can contain:
```json
{
  "REDEEMED STATUS": "Redeemed"
}
```
_or_
```json
{
  "REDEEMED STATUS": "Token Expired or Already Redeemed"
}
```
___
### TODO
* Add client authentication functionality.
