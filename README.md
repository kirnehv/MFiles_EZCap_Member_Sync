# Member Sync
A script to specifically keep [EZCap](https://www.citrahealth.com/solutions/ez-cap) and [M-Files](https://www.m-files.com/) member objects in sync.

Technology used: JavaScript, Node, Docker

## Dependencies
* [NodeJS](https://nodejs.org/en/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)
* [Docker Compose](https://docs.docker.com/compose/install/)

## Install
1. Clone this repository to a machine that has access to both EZCap and M-Files database.
2. Run `yarn install` in root directory to install necessary modules.

## Run
* Run `node server.js` in bin directory.
or
* Setup a database and name it `tunify` (can use **phpMyAdmin**) and import the sql file
* Run `docker-compose up -d` in root directory.
