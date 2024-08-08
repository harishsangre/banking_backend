This is just a simple representation of a banking app where user can created,login,deposit,withdraw,transfer,get transaction details.

You need to create a .env file and paste the below two parameres into it

MONGO_URI=mongodb+srv://yourusername:yourpassword@f1.l0jaxsd.mongodb.net/banking-app-?retryWrites=true&w=majority&appName=cluster
JWT_SECRET=6a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8scew9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

Remember you need to give your MONGO_URI, in place of yourusername,yourpassword, and cluster write your credentials.
Login to your mongodb atlas accound create a cluster and then create a database in my case banking-app,then create two collections accounts and transactions

Whitelist Your IP Address:
In MongoDB Atlas, you need to whitelist the IP address of the machine where your application is running. You can do this in the “Network Access” section of your MongoDB Atlas dashboard.
------------------------------------------------------------------------------------------------------------------------------------
Create Account 
Route - http://localhost:3000/api/createaccounts
For testing the api on post-man user the below parameters
name:Abhishekh
initialAmount:0
email:abhishekh@gmail.com
password:abhi@123

In response you get the below things
 "name": "akash",
    "email": "akash@gmail.com",
    "password": "$2b$10$dML1XJ8UyLcON.slHE0AU.pCp419N3Rt6kyJ60tMbepwmxyB2wIqm",
    "balance": 0,
    "deleted": false,
    "_id": "66b50c8f9e8b81a39d44ba9e",
    "createdAt": "2024-08-08T18:21:03.407Z",
    "accountNumber": "ACCT-lzlltg6r-7DDDED",
    "__v": 0
---------------------------------------------------------------------------------------------------------------------------------------
Login into the account
Route - http://localhost:3000/api/login
email:abhishekh@gmail.com
password:abhi@123

In response you get a token use this in the remaining apis by sending it in the headers use key authorization like below
authorization:Berear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmI0ZjJlOTVmZjI5NTY0NjlmYTBk
---------------------------------------------------------------------------------------------------------------------------------------
Deposit amount to an account
Route - http://localhost:3000/api/accounts/deposit
For testing the api on post-man use the below parameters
amount:1000
accountNumber:ACCT-lzlhwpjc-C17BDA (This is the account number you get while creating the account)

In response you get a message ( "message": "Amount 1000 deposited successfull, available balance 39000.1")
---------------------------------------------------------------------------------------------------------------------------------------
Withdraw amount from an account
Route - http://localhost:3000/api/accounts/withdraw
For testing the api on post-man use the below parameters
amount:1000
accountNumber:ACCT-lzlhwpjc-C17BDA

In response you get a message ("message": "Amount 1000 withdraw successfull, available balance 38000.1")
--------------------------------------------------------------------------------------------------------------------------------------
Transfer amount to an accountNumber
Route - http://localhost:3000/api/accounts/transfer
For testing the api on post-man use the below parameters
amount:500
toAccountNumber:ACCT-lzlg79wk-9596EF

In response you get a message( "message": "Amount transferred successfully")
--------------------------------------------------------------------------------------------------------------------------------------
Get the account details by id
Route - http://localhost:3000/api/getaccounts
For testing the api on post-man use the below parameters(send this parameter in the query params)
id:66b4f2e95ff2956469fa0d0e

In response you get the below data
  "_id": "66b4f2e95ff2956469fa0d0e",
    "name": "Abhishekh",
    "email": "abhishekh@gmail.com",
    "password": "$2b$10$gv6/JdxaydWf3Vy8iC.nb.KeO.fvcIPNcWmSumC326Sl5aP8qp6gS",
    "balance": 0,
    "deleted": false,
    "createdAt": "2024-08-08T16:31:37.025Z",
    "accountNumber": "ACCT-lzlhwpjc-C17BDA",
    "__v": 0
}
-------------------------------------------------------------------------------------------------------------------------------------
Delete the account by id
Route - http://localhost:3000/api/deleteaccount
For testing the api on post-man use the below parameters(send this parameter in the query params)
id:66b4f2e95ff2956469fa0d0e

In response you get a message("message": "Account marked as deleted successfully")





