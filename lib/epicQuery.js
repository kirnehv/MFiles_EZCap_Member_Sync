const sql = require('mssql');
const { Logger } = require('../lib');

class EpicQuery {

  constructor(config) {
    this.config = {
      user: config.EPIC_DB_USER,
      password: config.EPIC_DB_PASS,
      domain: config.CCHS_DOMAIN,
      server: config.EPIC_DB_HOSTNAME,
      database: config.EPIC_DB,
      options: {
          enableArithAbort: true
      }
    };
  }

  async getIDs(){
    await sql.connect(this.config);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    const result = await request.query(`
                SELECT p.[PAT_NAME]
                   ,i.IDENTITY_ID as 'EZCAP_MEMBID'
                   ,replace(replace(p.[PAT_MRN_ID],'<',''),'>','') AS 'Epic_MRN'
                FROM CLARITY.[dbo].[PATIENT] p left outer join CLARITY.dbo.identity_id i on
                p.PAT_ID = i.PAT_ID
                where i.IDENTITY_TYPE_ID = '5850001' -- gsmhp group identity id
                `
    );
    // const recordset = await request.query("SELECT rmc.fullname AS 'full_name', rmc.membid AS 'member_id', rmc.birth AS 'birthdate', rmc.company_id AS 'ipa', rmc.userfield1 AS 'HICN', rmc.patid AS 'MBI' FROM ecd.dbo.rv_memb_company rmc WHERE ( rmc.opthrudt IS NULL OR rmc.opthrudt = '') AND rmc.company_id NOT IN ( 'GPH' )");
    await sql.close();
    return result.recordset;
  }
}
module.exports = EpicQuery;
