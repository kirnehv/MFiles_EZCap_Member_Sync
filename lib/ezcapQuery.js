const sql = require('mssql');
const { Logger } = require('../lib');

class EZCapQuery {

  constructor(config) {
    this.config = {
      user: config.EZCP_USER,
      password: config.EZCP_PASS,
      domain: config.GSMHP_DOMAIN,
      server: config.EZCP_DB,
      options: {
          enableArithAbort: true
      }
    };
  }

  async getMembers(){
    let oneDay = 24*60*60*1000;
    let t = new Date();
    let z = t.getTimezoneOffset() * 60 * 1000;
    let tLocal = t-z-oneDay;
    tLocal = new Date(tLocal);
    let iso = tLocal.toISOString();
    await sql.connect(this.config);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    const result = await request.query(`
      SELECT    LASTCHANGEDATE as date,
                fullname AS 'full_name',
                firstnm AS 'first_name',
                mi AS 'middle_name',
                lastnm AS 'last_name',
                membid AS 'member_id',
                birth AS 'birthdate',
                company_id AS 'ipa',
                PATID AS 'mbi',
                street AS 'address',
                street2 AS 'address2',
                city AS 'city',
                state AS 'state',
                zip AS 'zip',
                (CASE WHEN opthrudt IS NULL OR opthrudt >= getdate() THEN 'ENRL' ELSE 'DSENRL' END) enroll_status
                FROM ecd.dbo.rv_memb_company
                WHERE company_id NOT IN ( 'GPH' )
                AND LASTCHANGEDATE >= '${iso}'`
    );
    // const recordset = await request.query("SELECT rmc.fullname AS 'full_name', rmc.membid AS 'member_id', rmc.birth AS 'birthdate', rmc.company_id AS 'ipa', rmc.userfield1 AS 'HICN', rmc.patid AS 'MBI' FROM ecd.dbo.rv_memb_company rmc WHERE ( rmc.opthrudt IS NULL OR rmc.opthrudt = '') AND rmc.company_id NOT IN ( 'GPH' )");
    await sql.close();
    return result.recordset;
  }
}
module.exports = EZCapQuery;
