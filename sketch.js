let boat;
let permissionGranted = false;
let x, y, z, xx, zz;
let bsz;
let yarr = [];
let xarr = [];
let zarr = [];
let sz;
let sky;
let spots = [];
let ssn = 136;
let sundata;
let date; // global as because it it used by different function
let input;

function preload() {
  boat = loadImage("metalboat1.png");
  sky = loadImage("sky.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  input = createInput();
  input.attribute("type", "date");
  input.position(40, 40);
  input.style("font-size", "24px");
  input.value("1971-07-11");
  button = createButton("Sun Spot");
  button.position(40, 90);
  makeSunSpots(ssn);
  print(spots);
  button.mousePressed(getdate);

  angleMode(DEGREES);
  bsz = windowWidth / 2;
  boat.resize(bsz, 0);
  sky.resize(windowHeight, 0);
  x = 0;
  sz = width / 200;
  imageMode(CENTER);
  // added code for os phones
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    // ios 13 device
    DeviceOrientationEvent.requestPermission()
      .catch(() => {
        // show permissionn dialog only the first time
        let button = createButton("click to allow access to sensors");
        button.style("font-size", "24px");
        button.center();
        button.mousePressed(requestAccess);
        throw error;
      })
      .then(() => {
        // on any subsequent visit
        permissionGranted = true;
      });
  } else {
    // non ios devise
    // grant access anyway
    console.log("went through the permessions checkcheck");
    permissionGranted = true;
  }
}

function requestAccess() {
  DeviceOrientationEvent.requestPermission()
    .then((response) => {
      if (response == "granted") {
        permissionGranted = true;
      } else {
        permissionGranted = false;
      }
    })
    .catch(console.error);
  // remove the button
  this.remove();
}

function draw() {
  //background(150,150,255);
  background(0);
  // y sky
  fill(0, 0, 130);
  push();
  translate(width / 2, height / 2);
  rotate((frameCount / 5) % 360);
  image(sky, 0, 0);
  pop();

  // sunspots
  push();
  noStroke();
  textSize(40);
  fill(0, 255, 0);
  text(ssn, 40, 40);
  translate(width / 2, height / 2);
  fill(255, 255, 0);
  ellipse(0, 0, width, height);

  for (let i = 0; i < spots.length; i++) {
    spots[i].move();
    spots[i].display();
    //print(spots[0].x,spots[0].y)
  }
  pop();

  xx = accelerationX * 10;
  zz = accelerationZ * 10;
  y = accelerationY * 10;
  yarr.unshift(y);
  zarr.unshift(zz);
  xarr.unshift(xx);
  if (yarr.length > 200) {
    yarr.pop();
  }
  stroke(255, 0, 0);
  strokeWeight(8);
  noFill();
  // y line
  beginShape();
  for (let i = 0; i < yarr.length; i++) {
    //ellipse(i*sz,height/4+yarr[i],30,30 )
    vertex(i * sz, height / 4 + yarr[i]);
  }
  endShape();
  // xline
  stroke(0, 255, 255);
  beginShape();

  for (let i = 0; i < xarr.length; i++) {
    //ellipse(i*sz,height/4+yarr[i],30,30 )

    vertex(i * sz, height / 2 + xarr[i]);
  }

  endShape();
  // z line
  beginShape();
  stroke(0, 255, 0);
  for (let i = 0; i < zarr.length; i++) {
    //ellipse(i*sz,height/4+yarr[i],30,30 )
    vertex(i * sz, height / 1.2 + zarr[i]);
  }
  endShape();

  push();
  translate(width / 2, height / 2);
  x = accelerationX * 4;
  z = accelerationZ * 0.05;

  scale(1 + z);
  rotate(x);
  image(boat, 0, 0);
  pop();
}

function getdate() {
  date = input.value();
  print(date);
  let link =
    "https://data.smartidf.services/api/records/1.0/search/?dataset=daily-sunspot-number&q=&sort=-column_4&facet=year_month_day&facet=column_5&facet=column_6&facet=column_7&refine.year_month_day=" +
    date;
  sundata = loadJSON(link, showData);
}
function showData() {
  ssn = sundata.records[0].fields.column_5;
  print(ssn); // puls out just the sunspot number from the date
  if ((ssn) => 0) {
    makeSunSpots(ssn);
  }
  createP(date + " Number: " + str(ssn));
}

function makeSunSpots(num) {
  // need to make them only on the disk of the sun
  // get position in polar and plot in cartesian
  // the x and y cord
  spots = [];
  for (let i = 0; i < num; i++) {
    // pick a random angle and radius
    let theta = random(360);
    let r = random(width / 2 - 10);

    let x = r * cos(theta);
    let y = r * sin(theta);

    spots[i] = new Spot(x, y);
  }
}
