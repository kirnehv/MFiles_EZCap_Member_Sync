const axios = require('axios');
const path = require('path');
const fs = require('fs');
const https = require('https');

const fsp = fs.promises;
let updateCounter = 0;
let addCounter = 0;

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

//Class for MFiles API
class MFilesAPI {
  //Sets URL and headers for API call
  constructor(config) {
    this.axios = axios.create({
      baseURL: config.MF_API_URL,
      headers: {
        'Content-Type' : 'application/json',
        'X-Authentication': config.MF_AUTH
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
  }
  //get all member objects from M-Files
  async memberObjectsMfiles(){
    const membs = await this.axios.get('/objects?o=103&p100=60&limit=0');
    return membs;
  }
  //add or update members in M-Files
  async compareDBs(membersDbEZCap, membersDbMFiles/*, membersDbEpic*/){
    //loop through EZCap members
    for (let memberEZCap of Object.values(membersDbEZCap)) {
      var epicMRN = 'Not in Epic';
      //if member in EZCap exists in M-Files
      let memberMatchMfiles = membersDbMFiles.data.Items.find(o => parseInt(o.Title, 10) === parseInt(memberEZCap.member_id, 10));
      // for (const memberDbEpic of membersDbEpic){
      //   if (memberDbEpic.EZCAP_MEMBID == memberEZCap.member_id){
      //     epicMRN = memberDbEpic.Epic_MRN;
      //   }
      // }
      //if member in EZCap does not exist in M-Files
      if(memberMatchMfiles == null){
        //add member
        await this.addMember(memberEZCap, epicMRN);
        addCounter += 1;
        console.log(`Member ADDED : ${memberEZCap.full_name}`);
      }else{
        //update existing member
        await this.updateMember(memberEZCap, memberMatchMfiles, epicMRN);
        updateCounter += 1;
        console.log(`Member UPDATED : ${memberEZCap.full_name}`);
      }
    }
    const counters = [addCounter, updateCounter]
    return counters;
  }
  async updateMember(memberEZCap, memberMatchMfiles, epicMRN){
    //check if memberID is a number
    // const memberId = Number(memberEZCap.member_id);
    // //if memberID is not a number, next
    // if (isNaN(memberId))
    //   return;
    //default member status to be terminated
    let memStatus = 2;
    let addr2 = memberEZCap.address2;
    if (memberEZCap.address2 == null) {addr2 = ''};
    //if member status is active in EZCap, set to active in M-Files
    if (memberEZCap.enroll_status === 'ENRL'){ memStatus = 1; }
    let updateData = [

    	  {
    		//Name
    	    "PropertyDef": 1123,
    	    "TypedValue": { "DataType": 1, "Value": memberEZCap.full_name }
        },
        {
    		// First Name
    	    "PropertyDef": 1300,
    	    "TypedValue": { "DataType": 1, "Value": memberEZCap.first_name }
        },
        {
    		// Middle Name
    	    "PropertyDef": 1301,
    	    "TypedValue": { "DataType": 1, "Value": memberEZCap.middle_name }
        },
        {
    		// Last Name
    	    "PropertyDef": 1302,
    	    "TypedValue": { "DataType": 1, "Value": memberEZCap.last_name }
        },
        {
        	//Class: Member
            "PropertyDef": 100,
            "TypedValue": { "DataType": 9, "Lookup": { "Item": 60 } }
        },
        {
        	//Date of Birth
            "PropertyDef": 1117,
            "TypedValue": { "DataType": 5, "Value": memberEZCap.birthdate }
        },
        {
        	//Member ID
            "PropertyDef": 1168,
            "TypedValue": { "DataType": 1, "Value": memberEZCap.member_id }
        },
        {
          //Epic Member ID
            "PropertyDef": 1270,
            "TypedValue": { "DataType": 1, "Value": epicMRN }
        },
        {
        	//IPA
            "PropertyDef": 1146,
            "TypedValue": { "DataType": 1, "Value": memberEZCap.ipa }
        },
        {
        	//Status
            "PropertyDef": 1141,
            "TypedValue": { "DataType": 9, "Lookup": { "Item": memStatus } }
        },
        {
        	//MBI
            "PropertyDef": 1166,
            "TypedValue": { "DataType": 1, "Value": memberEZCap.mbi }
        },
        {
          // Address
            "PropertyDef": 1428,
            "TypedValue": { "DataType": 1, "Value": memberEZCap.address }
        },
        {
          // Address 2
            "PropertyDef": 1429,
            "TypedValue": { "DataType": 1, "Value": addr2 }
        },
        {
          // City
            "PropertyDef": 1430,
            "TypedValue": { "DataType": 1, "Value": memberEZCap.city }
        },
        {
          // State
            "PropertyDef": 1431,
            "TypedValue": { "DataType": 1, "Value": memberEZCap.state }
        },
        {
          // Zip
            "PropertyDef": 1432,
            "TypedValue": { "DataType": 1, "Value": memberEZCap.zip }
        },
        {
        	//Multi-File
            "PropertyDef": 22,
            "TypedValue": { "DataType": 8, "Value": false }
        }
      ]

    await this.axios.put(`/objects/103/${memberMatchMfiles.DisplayID}/latest/properties`, updateData);
  }
  //Upload file from MFiles temp directory to MFiles DB
  async addMember(memberEZCap, epicMRN) {
    // //check if memberID is a number
    // const memberId = Number(memberEZCap.member_id);
    // //if memberID is not a number, next
    // if (isNaN(memberId))
    //   return;
    //default member status to be terminated
    let memStatus = 2;
    let addr2 = memberEZCap.address2;
    if (memberEZCap.address2 == null) {addr2 = ''};
    //if member status is active in EZCap, set to active in M-Files
    if (memberEZCap.enroll_status === 'ENRL'){ memStatus = 1; }
    //body of POST
    let data = {
      "PropertyValues": [{
  		//Name or Title
          "PropertyDef": 1123,
          "TypedValue": { "DataType": 1, "Value": memberEZCap.full_name }
      },
      {
      // First Name
        "PropertyDef": 1300,
        "TypedValue": { "DataType": 1, "Value": memberEZCap.first_name }
      },
      {
      // Middle Name
        "PropertyDef": 1301,
        "TypedValue": { "DataType": 1, "Value": memberEZCap.middle_name }
      },
      {
      // Last Name
        "PropertyDef": 1302,
        "TypedValue": { "DataType": 1, "Value": memberEZCap.last_name }
      },
      {
      	//Class
          "PropertyDef": 100,
          //Choose Member Class
          "TypedValue": { "DataType": 9, "Lookup": { "Item": 60 } }
      },
      {
      	//Prop Def: Date of Birth
          "PropertyDef": 1117,
          "TypedValue": { "DataType": 5, "Value": memberEZCap.birthdate }
      },
      {
      	//Prop Def: Member ID
          "PropertyDef": 1168,
          "TypedValue": { "DataType": 1, "Value": memberEZCap.member_id }
      },
      {
        //Epic Member ID
          "PropertyDef": 1270,
          "TypedValue": { "DataType": 1, "Value": epicMRN }
      },
      {
      	//IPA
          "PropertyDef": 1146,
          "TypedValue": { "DataType": 1, "Value": memberEZCap.ipa }
      },
      {
        //Status
          "PropertyDef": 1141,
          "TypedValue": { "DataType": 9, "Lookup": { "Item": memStatus } }
      },
      {
        //MBI
          "PropertyDef": 1166,
          "TypedValue": { "DataType": 1, "Value": memberEZCap.mbi }
      },
      {
        // Address
          "PropertyDef": 1428,
          "TypedValue": { "DataType": 1, "Value": memberEZCap.address }
      },
      {
        // Address 2
          "PropertyDef": 1429,
          "TypedValue": { "DataType": 1, "Value": addr2 }
      },
      {
        // City
          "PropertyDef": 1430,
          "TypedValue": { "DataType": 1, "Value": memberEZCap.city }
      },
      {
        // State
          "PropertyDef": 1431,
          "TypedValue": { "DataType": 1, "Value": memberEZCap.state }
      },
      {
        // Zip
          "PropertyDef": 1432,
          "TypedValue": { "DataType": 1, "Value": memberEZCap.zip }
      }]

    }
    //Upload file as a Document Object along with MetaData
    await this.axios.post('/objects/103', data);
  }
}

module.exports = MFilesAPI;
