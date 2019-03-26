// require
const readlineSync = require('readline-sync')
const colors = require('colors');

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
      accountBalance();
      break;
    case 4:
      viewTransactionHistory();
    case 5:
      console.log("Log Out");
      checkUser();
      break;
 }
}

function makeDeposit(){
  console.log(colors.bold.underline("\nMake a Deposit\n"));
  // capture user input
  let amount = readlineSync.question(plsDepositMsg);

  // record transaction
  currentUser["log"].push(['deposit', amount, Date.now()]);

  // print confirmation message
  console.log("\n" + "You have deposited $" + amount);

  showMenu();
};

function makeWithdrawl() {
  console.log(colors.bold.underline("\nMake a Withdrawal\n"));
  // capture user input
  let amount = readlineSync.question(plsDepositMsg);

  // record transaction
  currentUser["log"].push(['withdrawal', amount, Date.now()]);

  // print confirmation message
  console.log("\n" + "You have withdrawn $" + amount);

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

function accountBalance() {
  console.log(colors.bold.underline("\nAccount Balance\n"));

  // if there is a transaction history
  if (currentUser["log"].length > 0) {
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
    console.log(noTransactionsMsg)
  }
  // print account Balance
  console.log("Your account balance is: $" + colors.bold(currentUser["accountBalance"]));

  // take user back to main menu
  showMenu();
}

// user login
function checkUser() {
  // prompt for username
  let username = readlineSync.question("Please enter your username: ");
  // prompt for password
  let password = readlineSync.question("Please enter your password: ", { hideEchoBack: true });

  // if user is in usersData
  if (usersData[username]) {
    // check password
    console.log("Loggin in...");
    if (usersData[username]["password"] === password) {
      let password = readlineSync.question("Incorrect password. Please enter your password: ", { hideEchoBack: true });
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
    // console.log(currentUser);
    // console.log(usersData);
  }
  showMenu();
} // end user login



function openLedger() {
  // weclome message
  console.log("\n" + starDivider + "Welcome to the World's Greatest Ledger" + starDivider + "\n");
  // user login
  checkUser();
} // end openLedger

openLedger();
