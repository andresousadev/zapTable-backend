Flows:

User register account (Sign-up)

- email
- name
- password

User logins in (Sign-in)

- email
- password

  - BE saves a salted refresh token to the user table
  - BE returns access token and refresh token to the client

User makes requests using the access token to authenticate and authorization

After the access token expires (15m), the FE automaticly refreshes the access token using the refresh token (expiration time of 30 days)

User logout

- BE deletes the refresh token saved on the user table, to force the user to sign-in again using the password
