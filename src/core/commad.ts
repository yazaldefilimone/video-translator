import { terminal } from "terminal-kit";
import { message } from "~/shared/messages";
const serverError = "Internal Error, try again later";
const command = async () => {
  terminal.clear();
  const languageOptionsSystem = ["pt", "en"];
  const languageOptions = ["1. Português", "2. English"];
  const comm = new Map();

  terminal.singleColumnMenu(languageOptions, function (error, response) {
    if (error) {
      terminal.red(serverError);
      process.exit();
    }
    const c = languageOptionsSystem[response.selectedIndex] as "en" | "pt";
    const messages = message[c];

    terminal(messages.terminal.file);
    terminal.fileInput({ baseDir: "../" }, function (error, input) {
      if (error) {
        terminal.red(serverError);
        process.exit();
      }
      comm.set("file", input);
      terminal("Do you like javascript? [Y|n]\n");

      terminal.yesOrNo({ yes: ["Y", "ENTER"], no: ["n"] }, function (error, result) {});
      process.exit();
    });
  });
};

command().then();
// terminal("Choose a file: ");

// terminal.fileInput({ baseDir: "../" }, function (error, input) {
//   if (error) {
//     terminal.red.bold("\nAn error occurs: " + error + "\n");
//   } else {
//     terminal.green("\nYour file is '%s'\n", input);
//   }
//   process.exit();
// });

// var items = ["a. Go south", "b. Go west", "c. Go back to the street"];

// terminal.singleColumnMenu(items, function (error, response) {
//   terminal("\n").eraseLineAfter.green(
//     "#%s selected: %s (%s,%s)\n",
//     response.selectedIndex,
//     response.selectedText,
//     response.x,
//     response.y
//   );
//   process.exit();
// });
// terminal.clear();

// function question() {
//   terminal("Do you like javascript? [Y|n]\n");

//   // Exit on y and ENTER key
//   // Ask again on n
//   terminal.yesOrNo({ yes: ["y", "ENTER"], no: ["n"] }, function (error, result) {
//     if (result) {
//       terminal.green("'Yes' detected! Good bye!\n");
//       process.exit();
//     } else {
//       terminal.red("'No' detected, are you sure?\n");
//       question();
//     }
//   });
// }

// question();
