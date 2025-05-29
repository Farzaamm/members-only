# members can see the author of the post BUT non-members can only see the post

## members:
- first name
- last name
- user name
- password
- posts []

## msg
- title
- content
-timestamp -> auto
-(author)

## DB
- users table
- msges table

# to-do
[x] sign-up form
    [x] sanitize
    [x] validate
    [x] hash & salt

## members can only join clubs by entering a secrect passcode
[] join the club page by entering the passcode

[x] login form
[] if user logged-in -> show "create new msg"
[] create msg form

[] display all msgs on the homepage
[] only admins can DELETE msgs
