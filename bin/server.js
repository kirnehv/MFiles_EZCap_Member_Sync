const { MFilesAPI, Mail} = require('../lib');
const { MemberObjects } = require('../lib');
const { EZCapQuery } = require('../lib');
const { EpicQuery } = require('../lib');
const logger = require('../lib/logger');
const os = require('os');
const config = require('../config/config.json');

//declare objects to access classes
const api = new MFilesAPI(config);
const ezcap = new EZCapQuery(config);
const epic = new EpicQuery(config);
const mail = new Mail();

async function main() {
  console.log("Querying members...");
  //get members from EZCap
  const membersDbEZCap = await ezcap.getMembers();
  if (membersDbEZCap === undefined || membersDbEZCap.length == 0) {
    console.log("No Members to Add or Update.")
    logger.log("No Members to Add or Update.")
  }else{
    //get members from M-Files
    const membersDbMFiles = await api.memberObjectsMfiles();
    // get member IDs from EZCap and Epic
    // const membersDbEpic = await epic.getIDs();
    // console.log("Epic query finished.")
    //add or update members from EZCap to M-Files
    const counters = await api.compareDBs(membersDbEZCap, membersDbMFiles/*, membersDbEpic*/);
    //log count of members added and updated
    console.log(`${counters[0]} Members Added\n${counters[1]} Members Updated`);
    logger.log(`${counters[0]} Members Added\n${counters[1]} Members Updated`);
  }
}

process.on('unhandledRejection', logger.error);

main()
  .catch(async error => {
    // log error to logger
    await logger.fatal(error);
    // send error as mail
    await mail.sendMail(error.stack);
  })
  .catch(logger.fatal)
  .finally(async () => {
    logger.info("Program finished.");
  });
