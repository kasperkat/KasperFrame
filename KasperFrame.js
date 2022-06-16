const { SerialPort, ReadlineParser } = require('serialport')
const port = new SerialPort({ path: 'COM4', baudRate: 115200 })
const parser = new ReadlineParser();

const express = require("express");
const path = require("path");
const app = express();
const http_port = process.env.PORT || "8000";



content = "";
machineStatus = "";

// Serial communication
port.pipe(parser);

ready = false;
connected = false;
requestingData = false;
step = 0;

port.on('data', function (data) {
  
  // console.log(data.toString().indexOf("ok"))

  ready = true;

  if(requestingData){

    if(data.indexOf("Idle") >= 0){
      machineStatus = "Idle";
    }else if(data.indexOf("Run") >= 0 ){
      machineStatus = "Moving";
    }
    console.log(machineStatus);
    requestingData = false;
  }



  
})

function onConnect(){
   
  if(ready){
    port.write( content );
  }

}










// webapp
app.get("/", (req, res) => {
  // res.status(200).send("WHATABYTE: Food For Devs");
  res.sendFile(path.join(__dirname, '/index.html'));
});


// app.post('/', (req, res) => {
//   onConnect();
//   res.sendFile(path.join(__dirname, '/index.html'));
// })

app.post('/', (req, res) => {


  onConnect();

  const machineStatusStream = setInterval(getMachineStatus, 1000);

  function getMachineStatus() {

    if(machineStatus == "Idle"){
      console.log("STOP!");
      machineStatus = "";
      stopStatusStream();
    }else{
      requestingData = true;
      port.write("?\n");
    }



  }
  
  function stopStatusStream() {
    clearInterval(machineStatusStream);
  }

  


  res.sendFile(path.join(__dirname, '/index.html'));
})




app.listen(http_port, () => {
  console.log(`Listening to requests on http://localhost:${http_port}`);
});






// gcode generator


const fs = require ('fs');


step = 1.0;
length = 100;

initialSpeed = 100;
limit = 6000;

content = "G90\n";
content += "G1 X0 F6000\n";

for( i = 0; i <= (length / step); i ++ ){
    
    content +=  "G1 X" + i + " F" + speedCurve( i , initialSpeed , limit) + "\n" ;


}
content += "G1 X0 F6000\n";



function speedCurve(pos, inSpeed, limit){
    
    
    speed = Math.round(1 * (pos) + 1 * (pos*pos) + 1);

    if(speed > limit){
        speed = limit;
    }

    return speed + inSpeed;

}


fs.writeFile('test.gcode', content, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
  
console.log("hello world");




