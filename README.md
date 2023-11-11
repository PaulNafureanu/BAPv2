## Description

This is a workspace app that automates specific tasks on and over the internet. It is designed to only operate on a local Windows machine.

It is composed of 3 node js applications:

- Interface - a next js app that defines a local server and the user interface of the workspace app on http://localhost:3000/
- Browser - a web driver app based on Selenium version 4 that controls a Chrome browser.
- Windows - a win driver app based on Selenium version 3 and WinAppDrive that controls specific Windows apps.

## Getting Ready

First, ensure that you have the following apps/resources installed on your local Windows machine:

- [Chrome Web Browser](https://www.google.com/chrome/) - a Chrome web browser used for browser automation.
- [Chrome Driver](https://chromedriver.chromium.org/downloads) - a Chrome driver used to control the Chrome web browser.
- [WinAppDriver](https://github.com/microsoft/WinAppDriver) - a Windows driver used to control the Windows apps.
- [This code](https://github.com/PaulNafureanu/NetAutomation) - the code of the workspace app.

Notes:

- Ensure that, when downloading the chromedriver, its version is compatible with the version of the Chrome browser.
- Set the paths for both, the chromedriver.exe and the winappdriver.exe, in the environment variables on your local machine.
- Test the setup by opening PowerShell or command prompt shell and execute "chromedriver", and then "winappdriver", to check if both executable paths are found.
- Download the zip code files of the app from this git repository.

## Installation

Second, after downloading the zip code, extract the code files, then install all the packages required to run the workspace app:

```bash
npm install # in the root folder
```

## Running

Lastly, build the app:

```bash
npm build # in the root folder
```

Run the app by opening the start.bat file, or:

```bash
npm start # in the root folder
```

Notes:

- the bash file (start.bat) is a simple Windows script that opens a Chrome instance on http://localhost:3000/ and runs npm start without echo.

Optional: Create a desktop shortcut for start.bat and open it from there after building the app.
