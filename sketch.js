document.getElementById('airResistance').addEventListener('input', function () {
  airResistance = this.value * 0.01;
  updateVariablesOnScreen();
});
document.getElementById('armLength').addEventListener('input', function () {
  armLength = this.value;
  updateVariablesOnScreen();
});
document.getElementById('ballMass').addEventListener('input', function () {
  console.log(this.value);
});
document.getElementById('startAngle').addEventListener('input', function () {
  startAngle = this.value;
});
document.getElementById('acceleration').addEventListener('input', function () {
  gAccelaration = this.value * 0.001;
  updateVariablesOnScreen();
});
document.getElementById('resetAnimation').addEventListener('click', function () {
  reset();
});
document.getElementById('resetAnimation').addEventListener('click', function () {
  resetVariablesToDefault();
});
document.getElementById('stopStartAnimation').addEventListener('click', function () {
  stopStartAnimation();
  let button = document.getElementById('stopStartAnimation');
  if (button.value === 'Stop simulation') {
    button.value = 'Continue simulation';
  }
  if (button.value === 'Continue simulation') {
    button.value = 'Stop simulation';
  }
});
window.addEventListener('mousedown', function () {
  console.log('ballMass: ', ballMass);
  console.log('armLength: ', armLength);
  console.log('gAcceleration: ', gAccelaration);
  console.log('airResistance: ', airResistance);
  console.log('startAngle: ', startAngle);
  console.log('\n');
});

function updateVariablesOnScreen() {
  document.getElementById('airResistancePlaceholder').innerText = Math.round(airResistance);
  document.getElementById('armLengthPlaceholder').innerText = Math.round(armLength);
  document.getElementById('ballMassPlaceholder').innerText = Math.round(ballMass);
  document.getElementById('startAnglePlaceholder').innerText = Math.round(startAngle);
  document.getElementById('accelerationPlaceholder').innerText = Math.round(gAccelaration);
}

function reset() {
  angle = 0.01;
  speed = 0;
  amplitudePlot = [];
}

function resetVariablesToDefault() {
  ballMass = 30;
  armLength = 200;
  gAccelaration = 0.01;
  airResistance = 0.99;
  startAngle = 0;
}

function stopStartAnimation() {
  isStopped = !isStopped;
}

// helper functions
const sizeX = () => window.innerWidth / 2;
const sizeY = () => window.innerHeight / 2;

// helper variables
let isStopped = false;

// constants
const color = 120;

// TODO: fix variable updates
// initial parameters
let ballMass = 30;
let armLength = 200;
let gAccelaration = 0.01;
let airResistance = 0.99;
let startAngle = 0;

// variables
let angle = 0.01;
let speed = 0;

// plots
let amplitudePlot = [];
let speedPlot = [];


const simulation = s => {
  let canvas;

  s.setup = () => {
    canvas = s.createCanvas(sizeX(), sizeY());
    canvas.parent('simulationCanvas');
  };

  s.draw = () => {
    if (isStopped) {
      return;
    }
    s.background(255);
    s.translate(sizeX() / 2, sizeY() / 2);
    s.fill(color);
    s.stroke(color);
    s.ellipse(0, 0, 10, 10);

    let cosA = Math.cos(angle);
    let sinA = Math.sin(angle);
    let a = gAccelaration * Math.sin(angle);
    speed += a;
    speed *= airResistance;
    angle += speed;

    let drawCos = Math.cos(angle - Math.PI / 2);
    let drawSin = Math.sin(angle - Math.PI / 2);
    s.strokeWeight(4);
    s.line(0, 0, drawCos * armLength, drawSin * armLength);
    s.ellipse(drawCos * armLength, drawSin * armLength, 10, 10);

    speedPlot.push({speed, angle});
    amplitudePlot.push({x: cosA, y: sinA, angle});
  };

  s.windowResized = () => {
    s.resizeCanvas(sizeX(), sizeY());
  };

};


const waveGraph = s => {
  let canvas;

  s.setup = () => {
    canvas = s.createCanvas(sizeX(), sizeY());
    canvas.parent('graphCanvas');
  };

  s.draw = () => {
    if (isStopped) {
      return;
    }
    s.background(255);
    s.translate(0, sizeY() / 2);
    s.fill(color);
    s.stroke(color);

    for (let i = 0; i < amplitudePlot.length; i++) {
      if (i % 3 === 0) {
        s.ellipse(i, amplitudePlot[i].y * 100, 5, 5);
      }
    }

    if (amplitudePlot.length > 500) {
      amplitudePlot = amplitudePlot.slice(1, amplitudePlot.length);
    }
  };

  s.windowResized = () => {
    s.resizeCanvas(sizeX(), sizeY());
  };

};


const plotGraph = s => {
  let canvas;

  s.setup = () => {
    canvas = s.createCanvas(sizeX(), sizeY());
    canvas.parent('plotCanvas');
  };

  s.draw = () => {
    if (isStopped) {
      return;
    }
    s.background(255);
    s.translate(0, sizeY() / 2);
    s.fill(color);
    s.stroke(color);

    for (let i = 0; i < speedPlot.length; i++) {
      if (i % 3 === 0) {
        s.ellipse(i, speedPlot[i].speed * 100, 5, 5);
      }
    }

    if (speedPlot.length > 500) {
      speedPlot = speedPlot.slice(1, speedPlot.length);
    }
  };

  s.windowResized = () => {
    s.resizeCanvas(sizeX(), sizeY());
  };

};

let simulationP5 = new p5(simulation);
let waveGraphP5 = new p5(waveGraph);
let plotGraphP6 = new p5(plotGraph);