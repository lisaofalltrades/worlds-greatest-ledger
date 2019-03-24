# World's Greatest Bank Ledger

## Getting Started
- print welcomeMsg
- run userLogin
  - ask for username
  - capture username
  - check for username in userData
  - if username is in dictionary, ask for password & check
    - if password is incorrect, ask user to try again
      - should there be a limit? maybe 3 times before program exits?
    - if password is correct, user is logged in
  - else
    - add username to users dictionary
    - then ask user to create a password
    - ask user to confirm password
    - log user in
- or quit

## User portal
- show account balance
- show menu
  - 1. Make a deposit
  - 2. Make a withdrawal
  - 3. View transaction history
  - 4. Log out
- run userLogin or exit program

## Make a Deposit
- print "Account Balance: "
- print "Deposit Amount:"
- capture user input & check
  - integers greater than 0
  - if error: ask user to enter the correct amount
  - if no error: log deposit to userData
  - print success message and display account balance
- show menu

## Make a Withdrawal
- print "Account Balance"
- print "withdrawal Amount:"
- Capture user input and check
  - integers only greater than 0
  - if error: ask user to enter the correct amount
  - if no error: log withDrawal to userData
  - print success message and display account balance
- show menu

## Transaction History
- print "Account Balance"
- print "Transaction History:"
- access log in userData object
- print log DSC
  - if deposit, print in green
  - if withdrawal, print in red
