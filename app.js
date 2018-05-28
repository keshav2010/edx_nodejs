var http = require('http');
var fs = require('fs');
var path = require('path');
var lineReader = require('line-by-line');
//CSV : 1st row = header
const convertCSV = function(fileName = process.argv[2])
{
  const createJSON = function(line, keys)
  {
    var values = [];
    line.split(',').forEach( function(value){
      values.push(value);
    });
    var JSONString = '{';
    for(var i=0; i<=keys.length-2; i++)
    {
        if(keys[i].indexOf("name")>=0 ||
          keys[i].indexOf("email")>=0 || keys[i].indexOf("gender")>=0 ||
          keys[i].indexOf("address") >=0 || keys[i].indexOf("ssn") >=0 ||
          keys[i].indexOf("bitcoin")>=0)
        JSONString += '"'+keys[i]+'" :'+ '"' + values[i]+'"';
        else JSONString += '"'+keys[i]+'" :'+values[i];

        if(i== keys.length-2)
          continue;
        else JSONString += ',';
    }
    JSONString += '}';
    console.log("JSONString = " + JSONString);
    var JSONObject = JSON.parse(JSONString);
    console.log("The JSON object is : " + JSONObject);
    return JSONObject;
  }
    var filePath = path.join(__dirname, fileName);
    var i=0;
    console.log("file path  : "+filePath);

    var reader = new lineReader(filePath);
    //synchronous processing of lines
    reader.on('error', (err)=>{
      //err
    });
    var keys = []; //array storing keys
    var jsonArray = [];
    reader.on('line', (line)=>{
      //parse to JSON object
      if(i==0){
        i++;
        line.split(',').forEach( (key)=>{
          keys.push(key.trim());
        });
        return;
      }
      console.log(line+"<<");
      jsonArray.push(createJSON(line, keys));
      i++;
    });
    reader.on('end', ()=>{
      //all lines are read, file closed
      console.log("end of file : " + jsonArray.length);
      fs.writeFileSync('customer-data.json', JSON.stringify(jsonArray));
    });
    return jsonArray;
}
convertCSV("customer-data.csv");
