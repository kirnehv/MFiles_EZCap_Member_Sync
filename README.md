# Member Sync
A script to specifically keep [EZCap](https://www.citrahealth.com/solutions/ez-cap) and [M-Files](https://www.m-files.com/) member objects in sync. Email functionality

Technology used: JavaScript, Node, Docker

## Dependencies
* [NodeJS](https://nodejs.org/en/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)
* [Docker Compose](https://docs.docker.com/compose/install/)

## Install
1. Clone this repository to a machine that has access to both EZCap and M-Files database.
2. Run `yarn install` in root directory to install necessary modules.
3. Create **config.json** in config directory. See **config.sample.json**.

## Run
* **Either**..Run directly in bin directory:
```bash
node server.js
```
* **Or**..........Run a docker container from root directory:
```bash
docker-compose up -d
```
