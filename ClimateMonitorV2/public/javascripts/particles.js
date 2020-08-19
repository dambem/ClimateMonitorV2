var NUM_OF_PARTICLES = 100;
var FORCE = 0.05,
  FORCEMin = 0.01,
  FORCEMax = 0.1,
  FORCEStep = 0.01;
var MIN_DISTANCE = 5;
var MAX_DISTANCE = 150;
var xOffset = 0;
var SIZE = 50;
var ParticlesSpawnedPerType = 100,
  ParticlesSpawnedPerTypeMax = 250;
var SpawnRateInSeconds = 5,
  SpawnRateInSecondsMin = 1;
var particles = [];
// GUI Params
let GUI;
var PM10 = 20,
  PM10Min = 0,
  PM10Max = 100;
var PM2 = 20,
  PM2Min = 0,
  PM2Max = 100;
var CONTAINER_ID = "mortality_sim";
var NUM_LAYERS = 3;

function setup() {
  sketchWidth = window.innerWidth / 2; //document.getElementById(CONTAINER_ID).width;
  sketchHeight = window.innerHeight / 4; //document.getElementById(CONTAINER_ID).height;
  createCanvas(sketchWidth, sketchHeight).parent(CONTAINER_ID);
  background("white");
  frameRate(60);
  spawnParticles(NUM_OF_PARTICLES, NUM_LAYERS);

  GUI = createGui(
    "Parameters",
    document.getElementById(CONTAINER_ID),
    -window.innerWidth / 3.75,
    window.innerHeight / 1.2
  );
  GUI.addGlobals(
    "PM10",
    "PM2" //,
    // "ParticlesSpawnedPerType",
    // "SpawnRateInSeconds",
    // "FORCE",
    // "SIZE",
    // "NUM_LAYERS",
    // "MIN_DISTANCE",
    // "MAX_DISTANCE"
  );
}

function windowResized() {
  resizeCanvas(window.innerWidth / 2, window.innerHeight / 4);
}
function draw() {
  background(255, 125);
  xOffset = SIZE * 1.5;
  particles.forEach((particle) => {
    particle.update();
    particle.display();
  });
  //Every 2.5s add two particles
  if (frameCount % (60 * SpawnRateInSeconds) == 0) {
    spawnParticles(ParticlesSpawnedPerType, NUM_LAYERS);
  }
}
// Do cool spawning stuff
function spawnParticles(numberOfParticles, layers) {
  let particlesPerLayer = Math.floor(numberOfParticles / layers);
  let layerCount = 1;
  for (let i = 0; i < numberOfParticles; i++) {
    let vulnerable = random(-1, 1) < 0;
    let offset = vulnerable ? -1 : 1;
    if (vulnerable) {
    }
    particles.push(
      new Particle(vulnerable, particles.length, offset, layerCount)
    );
    if (i % particlesPerLayer == 0) {
      layerCount += 0.15;
    }
  }
}
class Particle {
  constructor(vulnerable = false, index, xOffsetFactor, layerNumber = 1) {
    this.age = 0;
    this.colour = vulnerable ? [255, 0, 0] : [0, 0, 255];
    this.alpha = 255;
    this.vulnerable = vulnerable;
    this.angularFactor = random(0, 10);
    this.lifespan = this.vulnerable ? 5 - lifeSpanReduction(PM10, PM2) : 5;
    this.size;
    this.xOffsetFactor = xOffsetFactor;
    this.position = {
      x: 0,
      y: 0,
    };
    this.motion = {
      velocity: { x: random(-2, 2), y: random(-2, 2) },
      acceleration: { x: 0, y: 0 },
    };
    this.layerNumber = layerNumber;
    this.neighbours = [];
    // For garbage collection purposes
    this.index = index;
  }
  // drawNeighbours() {
  //   strokeWeight(1);
  //   this.neighbours.forEach((neighbour) => {
  //     let endPoint = halfway(this.position, neighbour.position);
  //     line(this.position.x, this.position.y, endPoint.x, endPoint.y);
  //   });
  // }
  connectToMouse() {
    let distanceToMouse = getDistance(this.position, { x: mouseX, y: mouseY });
    if (distanceToMouse >= MIN_DISTANCE && distanceToMouse <= MAX_DISTANCE) {
      stroke(
        this.colour[0],
        this.colour[1],
        this.colour[2],
        map(distanceToMouse, MAX_DISTANCE, 0, 0, 255)
      );
      strokeWeight(1);
      line(this.position.x, this.position.y, mouseX, mouseY);
    }
  }
  update() {
    //Update acceleration
    this.motion.velocity = {
      x: 5 * Math.sin(this.angularFactor),
      y: 5 * Math.cos(this.angularFactor),
    };
    //Update speed
    // this.motion.velocity = addDictValues(
    //   this.motion.velocity,
    //   this.motion.acceleration
    // );
    //Update position

    this.position = {
      x:
        SIZE * Math.sin(this.angularFactor) * this.layerNumber +
        width / 2 +
        xOffset * this.xOffsetFactor,
      y: SIZE * Math.cos(this.angularFactor) * this.layerNumber + height / 2,
    }; //addDictValues(this.position, this.motion.velocity);
    if (this.position.x < 0 || this.position.x > width) {
      this.motion.velocity.x *= -1;
    }
    if (this.position.y < 0 || this.position.y > height) {
      this.motion.velocity.y *= -1;
    }
    this.age += 1 / 60; // Equivalent of seconds based on framerate
    this.alpha = map(this.age, 0, this.lifespan, 255, 0);
    this.size = map(this.age, 0, this.lifespan, 3, 9);
    this.angularFactor += FORCE;
    // this.neighbours = findNeighbours(this.position, MIN_DISTANCE, MAX_DISTANCE);
  }

  display() {
    stroke(this.colour[0], this.colour[1], this.colour[2], this.alpha);
    strokeWeight(this.size);
    point(this.position.x, this.position.y);
    // this.drawNeighbours();
    this.connectToMouse();
    if (this.age > this.lifespan) {
      removeParticle(this);
    }
  }
}
function mousePressed() {
  if (mouseButton == LEFT)
    particles.push(new Particle(true, particles.length, mouseX, mouseY));
  else {
    particles.push(new Particle(false, particles.length, mouseX, mouseY));
  }
}
function removeParticle(particle) {
  let index = particle.index;
  particles.splice(index, 1);
  delete particle;
  for (let i = index; i < particles.length; ++i) {
    particles[i].index--;
  }
}
// Debugging because printing every frame is overkill, mean to memory, and unnecessary really
function keyPressed() {
  console.log(particles);
}
// Some helper functions because I'm very lazy
function addDictValues(dict1, dict2) {
  sum = {};
  Object.keys(dict1).forEach((key) => {
    if (dict2[key]) {
      sum[key] = dict1[key] + dict2[key];
    }
  });
  return sum;
}
function lifeSpanReduction(PM10, PM2) {
  var validPM10 = 20;
  var validPM2 = 12;
  var PM10inc = (PM10 - validPM10) / 10;
  var PM2inc = (PM2 - validPM2) / 10;
  if (PM10inc < 0 && PM2inc < 0) {
    return 0;
  } else {
    return (PM10inc * 7 + PM2inc * 12) / 60;
  }
}

function getDistance(positionOne, positionTwo) {
  return Math.sqrt(
    Math.pow(positionOne.x - positionTwo.x, 2) +
      Math.pow(positionOne.y - positionTwo.y, 2)
  );
}

// function findNeighbours(particlePosition, minDistance, maxDistance) {
//   let neighbours = [];
//   particles.forEach((particle) => {
//     let distance = getDistance(particlePosition, particle.position);
//     if (distance >= minDistance && distance <= maxDistance)
//       neighbours.push(particle);
//   });
//   return neighbours;
// }

function halfway(pointA, pointB) {
  return { x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 };
}
// Remove context menu for Right-clicks
document.oncontextmenu = function () {
  return false;
};
