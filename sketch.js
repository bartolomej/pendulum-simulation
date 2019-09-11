document.getElementById('airResistance')
  .addEventListener('input', function () {
    airResistance = this.value * 0.01;
    updateVariablesOnScreen();
  });
document.getElementById('armLength')
  .addEventListener('input', function () {
    armLength = this.value;
    updateVariablesOnScreen();
  });
document.getElementById('ballMass')
  .addEventListener('input', function () {
    console.log(this.value);
  });
document.getElementById('startAngle')
  .addEventListener('input', function () {
    startAngle = this.value / 100;
    updateVariablesOnScreen();
  });
document.getElementById('acceleration')
  .addEventListener('input', function () {
    gAccelaration = this.value * 0.001;
    updateVariablesOnScreen();
  });
document.getElementById('resetVariables')
  .addEventListener('click', function () {
    resetInitialState();
  });
document.getElementById('resetAnimation')
  .addEventListener('click', function () {
    resetVariables();
  });
document.getElementById('leftPlotSelection')
  .onchange = function () {
    leftPlot = this.value;
  };
document.getElementById('topPlotSelection')
  .onchange = function () {
    topPlot = this.value;
  };
document.getElementById('stopStartAnimation')
  .addEventListener('click', function () {
    stopStartAnimation();
    let button = document.getElementById('stopStartAnimation');
    switch (button.value) {
      case 'PAUSE SIMULATION':  {
        button.value = 'CONTINUE SIMULATION';
        break;
      }
      case 'CONTINUE SIMULATION': {
        button.value = 'PAUSE SIMULATION';
        break;
      }
      default: {
        throw new Error('Unknown pause button value');
      }
    }
  });

function updateVariablesOnScreen() {
  document.getElementById('airResistancePlaceholder').innerText = Math.round(airResistance*100) + '%';
  document.getElementById('armLengthPlaceholder').innerText = Math.round(armLength).toString();
  document.getElementById('ballMassPlaceholder').innerText = Math.round(ballMass).toString();
  document.getElementById('startAnglePlaceholder').innerText = startAngle;
  document.getElementById('accelerationPlaceholder').innerText = Math.round(gAccelaration).toString();
}

function resetVariables() {
  angle = 3.14;
  speed = 0;
  amplitudePlot = [];
  speedPlot = [];
  accelerationPlot = [];
  WkPlot = [];
  WpPlot = [];
}

function resetInitialState() {
  angle = 3.14;
  speed = 0;
  ballMass = 30;
  armLength = 160;
  gAccelaration = 0.01;
  airResistance = 0.99;
  startAngle = 0;
}

function stopStartAnimation() {
  isStopped = !isStopped;
}

/**
 * COMMITS TO PUSH:
 * TODO: commit for implementing local p5.min.js package
 * TODO: commit for energy plot
 */

// TODO: fix variable updates
// TODO: draw vectors
// TODO: add ball mass to calculation
// TODO: add Wk / Wp plot

// helper functions
const sizeX = () => window.innerWidth / 2;
const sizeY = () => window.innerHeight / 2;

// helper variables
let isStopped = false;
let leftPlot = 'speed';
let topPlot = 'yAmplitude';

// constants
const color = 120;
const ballColor = 'rgb(255, 66, 66)';
const accelerationColor = 'rgb(150, 212, 63)';
const speedColor = 'rgb(63, 212, 118)';
const verticalAmplitudeColor = 'rgb(255, 189, 48)';
const horizontalAmplitudeColor = 'rgb(100, 100, 255)';
const potentialEnergyColor = 'rgb(100, 200, 255)';
const kineticEnergyColor = 'rgb(255, 100, 100)';

// initial parameters
let ballMass;
let armLength;
let gAccelaration;
let airResistance;
let startAngle;

// variables
let angle;
let speed;

// plots
let amplitudePlot = [];
let speedPlot = [];
let accelerationPlot = [];
let WkPlot = [];
let WpPlot = [];


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

    let posY = Math.cos(angle) * armLength * -1;
    let posX = Math.sin(angle) * armLength;
    let a = gAccelaration * Math.sin(angle) * -1;
    let h0 = armLength;
    let h = h0 + posX;
    let Wp = ballMass * gAccelaration * h;
    let Wk = (ballMass * speed * speed) / 2;

    speed += a;
    speed *= airResistance;
    angle += speed;

    // display current y values of functions
    displayValues(sizeX(), sizeY(), s, [{
      text: 'Angle',
      value: angle,
      color: ballColor
    }]);

    s.translate(sizeX() / 2, sizeY() / 2);
    s.fill(color);
    s.stroke(color);
    s.ellipse(0, 0, 10, 10);

    s.strokeWeight(4);
    s.line(0, 0, posX, posY * -1);
    s.fill(ballColor);
    s.stroke(ballColor);
    s.ellipse(posX, posY * -1, 10, 10);

    // save for historical plot
    accelerationPlot.push({y: a, angle});
    speedPlot.push({y: speed, angle});
    amplitudePlot.push({x: posX, y: posY, angle});
    WkPlot.push({y: Wk, angle});
    WpPlot.push({y: Wp, angle});
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
    s.background(255);

    if (topPlot === 'xAmplitude') {
      displayValues(sizeX(), sizeY(), s, [{
        text: 'Horizontal Amplitude',
        value: amplitudePlot[amplitudePlot.length - 1].x,
        color: horizontalAmplitudeColor
      }]);
    }
    if (topPlot === 'yAmplitude') {
      displayValues(sizeX(), sizeY(), s, [{
        text: 'Vertical Amplitude',
        value: amplitudePlot[amplitudePlot.length - 1].y,
        color: verticalAmplitudeColor
      }]);
    }

    s.translate(0, sizeY() / 2);
    s.noStroke();

    console.log(topPlot);

    if (topPlot === 'xAmplitude') {
      for (let i = 0; i < amplitudePlot.length; i++) {
        s.fill(horizontalAmplitudeColor);
        s.ellipse(i, amplitudePlot[i].x, 5, 5);
      }
    }
    if (topPlot === 'yAmplitude') {
      for (let i = 0; i < amplitudePlot.length; i++) {
        s.fill(verticalAmplitudeColor);
        s.ellipse(i, amplitudePlot[i].y * -1, 5, 5);
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
    s.background(255);

    // display current y values of functions
    if (leftPlot === 'speed') {
      displayValues(sizeX(), sizeY(), s, [{
        text: 'Speed',
        value: speedPlot[speedPlot.length-1].y,
        color: speedColor
      }]);
    }
    if (leftPlot === 'acceleration') {
      displayValues(sizeX(), sizeY(), s, [{
        text: 'Acceleration: ',
        value: accelerationPlot[accelerationPlot.length-1].y,
        color: accelerationColor
      }]);
    }
    if (leftPlot === 'energy') {
      displayValues(sizeX(), sizeY(), s, [{
        text: 'Potential energy',
        value: WpPlot[WpPlot.length-1].y,
        color: potentialEnergyColor
      },{
        text: 'Kinetic energy',
        value: WkPlot[WkPlot.length-1].y,
        color: kineticEnergyColor
      }]);
    }

    s.translate(0, sizeY() / 2);
    s.noStroke();

    if (leftPlot === 'speed') {
      for (let i = 0; i < speedPlot.length; i++) {
        s.fill(speedColor);
        s.ellipse(i, speedPlot[i].y * 400, 5, 5);
      }
    }
    if (leftPlot === 'acceleration') {
      for (let i = 0; i < accelerationPlot.length; i++) {
        s.fill(accelerationColor);
        s.ellipse(i, accelerationPlot[i].y * 1000, 5, 5);
      }
    }
    if (leftPlot === 'energy') {
      // green color representing kinetic energy
      for (let i = 0; i < WkPlot.length; i++) {
        s.fill(kineticEnergyColor);
        s.ellipse(i, WkPlot[i].y * -300, 5, 5);
      }
      // red color representing potential energy
      for (let i = 0; i < WpPlot.length; i++) {
        s.fill(potentialEnergyColor);
        s.ellipse(i, WpPlot[i].y, 5, 5);
      }
    }

    // remove oldest historical data from array
    if (speedPlot.length > 500) {
      speedPlot = speedPlot.slice(1, speedPlot.length);
    }
    if (accelerationPlot.length > 500) {
      accelerationPlot = accelerationPlot.slice(1, accelerationPlot.length);
    }
    if (WkPlot.length > 500) {
      WkPlot = WkPlot.slice(1, WkPlot.length);
    }
    if (WpPlot.length > 500) {
      WpPlot = WpPlot.slice(1, WpPlot.length);
    }
  };

  s.windowResized = () => {
    s.resizeCanvas(sizeX(), sizeY());
  };

};

// values = [ { text, color, value },... ]
const displayValues = (canvasWidth, canvasHeight, s, values) => {
  const margin = 10;
  const ySpacing = 20;
  for (let i = 0; i < values.length; i++) {
    if (values[i].color !== undefined) {
      s.fill(values[i].color);
    }
    s.noStroke();
    s.textSize(15);
    // round real number to 3 decimals
    let value = Math.round(values[i].value * 1000) / 1000;
    s.text(`${values[i].text}: ${value}`, margin, 20 + (i *ySpacing));
  }
};

const simulationP5 = new p5(simulation);
const waveGraphP5 = new p5(waveGraph);
const plotGraphP6 = new p5(plotGraph);