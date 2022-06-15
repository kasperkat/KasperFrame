
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