#!/usr/bin/env node
import fs from "fs";
import git from "gift";
import inquirer from "inquirer";
import { exec } from "child_process";
import { repos } from "./repositories.js";

const writeIntoFile = async (path, projectName, branch) => {
  await new Promise((resolve) =>
    git.clone(path, projectName, null, branch, (err, _repo) => {
      if (!err) {
        resolve(_repo);
        const fileName = `./${projectName}/package.json`;
        var src = fs.readFileSync(fileName);
        var srcObj = JSON.parse(src);
        srcObj.name = projectName;

        var updatedJson = JSON.stringify(srcObj, null, 4);
        fs.writeFile(fileName, updatedJson, function (err) {
          if (err) {
            return console.error(err);
          }
        });
        var Proc = exec(
          "npm i",
          {
            cwd: `./${projectName}`,
          },
          function (error, stdout, stderr) {
            if(stdout){
              console.log("congratulations! your project is ready to go");
              console.log("Please follow below commands to start your applications");
              console.log("cd {Project-directory}");
              console.log("npm start");
            } else {
              console.log(" there is some issue with installing packages");
            }
          }
        );
      } else {
        console.log(" Not able to authenticate you");
      }
    })
  );
};

(async function () {
  const { multipleUser } = await inquirer.prompt([
    {
      type: "confirm",
      name: "multipleUser",
      message: "Do you have mulitple user setup for your github account?",
      default: true,
    },
  ]);
  let userName;
  if (multipleUser) {
    const { name } = await inquirer.prompt([
      {
        type: "text",
        name: "name",
        message: "Enter your user Name:",
      },
    ]);
    userName = name;
  }
  const { project } = await inquirer.prompt([
    {
      type: "list",
      name: "project",
      message:
        "Which Project you want to clone from fiftyfive technology organization?",
      choices: Object.keys(repos),
    },
  ]);

  const { projectName } = await inquirer.prompt([
    {
      type: "text",
      name: "projectName",
      message: "Enter the name for your Project:",
    },
  ]);
  if (project === "react-javascript") {
    const { path, name, branch } = repos["react-javascript"];
    console.log(`Creating ${name} project into your local machine`);
    if (multipleUser) {
      path.replace("github.com", userName);
    }
    return writeIntoFile(path, projectName, branch);
  } else {
    const { path, name, branch } = repos["react-typescript"];
    console.log(`Cloning ${name} into your local machine`);
    if (multipleUser) {
      path.replace("github.com", userName);
    }
    return writeIntoFile(path, projectName, branch);
  }
})();
