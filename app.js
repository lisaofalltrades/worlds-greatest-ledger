// require
const inquirer = require('inquirer');

// declared variables
let userData = {};

// functions
function showMenu() {
  //
  inquirer.prompt([{
      type: "list",
      message: "Main Menu",
      choices: ["1. Make a Deposit",
                "2. Make a Withdrawal",
                "3. View Transaction History",
                "4. Log Out"],
      name: "userSelection",
  }]).then(function(answers) {
    userSelection = answers["userSelection"].slice(0, 1);
  });

} // end showMenu

function openLedger() {
  showMenu();
}

openLedger();
