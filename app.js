// require
const colors = require('colors');
const readlineSync = require('readline-sync');
const regex = require('regex');

// catching readlineSync exit issues
process.on('SIGINT', function() {
  console.log('\nI caught SIGINT signal.');
  process.exit();
});

process.on('SIGTERM', function() {
  console.log('\nI caught SIGTERM signal.');
  process.exit();
});

// ******* //
// classes //
// ******* //

class User {
  constructor(username, password, log, accountBalance) {
    this.username = username;
    this.password = password;
    this.log = log;
    this.accountBalance = accountBalance;
  }
}

// ********* //
// variables //
// ********* //

let usersData = {};
let currentUser;
let regexCurrenyCheck = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
let mainMenu = [
  "Make a Deposit",
  "Make a Withdrawal",
  "Account Balance",
  "View Transaction History",
  "Log Out"
]
let noTransactionsMsg = colors.yellow("Sorry, you have not made any transactions.");
let plsDepositMsg = colors.bold("Please enter amount: $");

let starDivider = (" * ").repeat(5);

// ********* //
// functions //
// ********* //

// user menu once logged in
function showMenu(username) {
  console.log(colors.bold.underline("\nMain Menu\n"));
  console.log(colors.bold("Please select from the options below: "));
  let index = readlineSync.keyInSelect(mainMenu)

  switch (index+1) {
    case 1:
      makeDeposit();
      break;
    case 2:
      makeWithdrawl();
      break;
    case 3:
     showAccountBalance();
      break;
    case 4:
      viewTransactionHistory();
    case 5:
      console.log("\nLogging out...");
      openLedger();
      break;
 }
}

function makeDeposit(){
  console.log(colors.bold.underline("\nMake a Deposit\n"));
  // capture user input
  let amount = readlineSync.question(plsDepositMsg);

  // throw error if input is not currency
  while (regexCurrenyCheck.test(amount) === false) {
    amount = readlineSync.question(colors.yellow("Amount entered not valid: $ "));
  }

  // record transaction
  currentUser["log"].push(['deposit', amount, Date.now()]);

  // update balance
  calculateAccountBalance()

  // print confirmation message
  console.log(colors.green("\n" + "You have deposited $" + amount));

  showMenu();
};

function makeWithdrawl() {
  console.log(colors.bold.underline("\nMake a Withdrawal\n"));
  // capture user input
  let amount = readlineSync.question(plsDepositMsg);

  // throw error if input is not currency
  while (regexCurrenyCheck.test(amount) === false) {
    amount = readlineSync.question(colors.yellow("Amount entered not valid: $ "));
  }

  // overdraft protection
  if (amount > currentUser["accountBalance"]) {
    console.log(colors.yellow("\nSorry, you do now have enough funds to withdrawal."));
  } else {
    // record transaction
    currentUser["log"].push(['withdrawal', amount, Date.now()]);
    // update account balance
    calculateAccountBalance()
    // print confirmation message
    console.log(colors.red("\n" + "You have withdrawn $" + amount));
  }
    showMenu();
}

let viewTransactionHistory = function(){
  console.log(colors.bold.underline("\nTransaction History\n"));

  if (currentUser["log"].length > 0) {
    let transactionHistory = currentUser["log"];
    var i;
    for (i in transactionHistory) {
      let category = transactionHistory[i][0];
      let amount = transactionHistory[i][1];
      let date = new Date(transactionHistory[i][2]).toLocaleDateString("en-US");

      if (category === "deposit") {
        console.log(colors.green(date + " + $" + amount));
      } else if (category === "withdrawal") {
        console.log(colors.red(date + " - $" + amount));
      } // end if category statement
    } // end for loop

  } else {
    console.log(colors.yellow(noTransactionsMsg))
  }
  showMenu();
}

function calculateAccountBalance() {
  // if there is a transaction history
  if (currentUser["log"].length > 0) {
    // set amount to 0 to properly recalculate every time
    currentUser["accountBalance"] = 0;

    let transactionHistory = currentUser["log"];

    var i;
    // for each transaction
    for (i in transactionHistory) {
      // assign category to variable category
      let category = transactionHistory[i][0];
      // convert string to float w/ two decimal points and assign to amount
      let amount = Math.round(transactionHistory[i][1] * 100) / 100;
      // if category is deposit, add to amount
      if (category === "deposit") {
        currentUser["accountBalance"] += amount
      // if category is withdrawal, subtract from amount
      } else if (category === "withdrawal") {
        currentUser["accountBalance"] -= amount
      } // end if statement checking category
    } // end for loop

  } else {
    currentUser["accountBalance"] = 0;
  }
}

function showAccountBalance() {
  console.log(colors.bold.underline("\nAccount Balance\n"));

  calculateAccountBalance()

  // if there is a transaction history
  if (currentUser["log"].length > 0) {
    // print account Balance
    console.log(colors.yellow("Your account balance is: $" + (currentUser["accountBalance"])));
  } else {
    console.log(noTransactionsMsg)
  }

  // take user back to main menu
  showMenu();
}

// user login
function checkUser() {
  let regex = "^\\s+$";

  let passwordCount = 2;
  // prompt for username
  let username = readlineSync.question("Please enter your username: ");

  // if username is blank, throw error
  while (username === ""){
    username = readlineSync.question("Username can not be blank: ");
  }

  // prompt for password
  let password = readlineSync.question("Please enter your password: ", { hideEchoBack: true });

  // if password is blank, throw error
  while (password === ""){
    password = readlineSync.question("Password cannot be blank: ", { hideEchoBack: true });
  }

  // if user is in usersData
  if (usersData[username]) {
    // check password
    console.log("Please wait while we verify your account...");

    while(passwordCount > 0){

      if(usersData[username]["password"] === password){
        console.log("logging in...");
        currentUser = usersData[username];
        showMenu();
      } else {
        password = readlineSync.question("Incorrect Password. Please enter your password again: ", { hideEchoBack: true });
        passwordCount--;
      }
    }

    if(passwordCount === 0){
      console.log(colors.yellow("You have reached maximum number of tries!"));
      openLedger();
    }

  } else { // if user is not in usersData, create account
    console.log("\nCreating account...\n");
    usersData[username] = new User (username, password);
    // setting user's transaction logs to array
    usersData[username]["log"] = []
    // setting starting balance at 0
    usersData[username]["accountBalance"] = 0
    console.log("Success! Welcome " + username + "!");
    // assign current user
    currentUser = usersData[username];
  }
  showMenu();
} // end user login



function openLedger() {
  // clear current user if any?
  currentUser = {}
  // weclome message
  console.log("\n" + starDivider + "Welcome to the World's Greatest Ledger" + starDivider + "\n");
  console.log("Please select an option below:");
  // log in or quit program
  let userSelection = readlineSync.keyInSelect(["Log In/Create Account"]);

  if (userSelection === 0) {
    // user login
    checkUser();
  } else if (userSelection === -1) {
    process.exit();
  }

} // end openLedger

openLedger();
