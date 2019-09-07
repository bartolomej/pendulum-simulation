const sizeX = () => window.innerWidth / 2;
const sizeY = () => window.innerHeight / 2;

let ballMass = 30;
let lineLength = 300;
let gAccelaration = 0.01;
let friction = 0.99;
let startAngle = 0;

let history = [];

const simulation = s => {
  let canvas;
  let angle = 0.01;
  let speed = 0;

  s.setup = () => {
    canvas = s.createCanvas(sizeX(), sizeY());
    canvas.parent('simulationCanvas');
    document.getElementById('defaultCanvas0').style.border = '4px solid black';
  };

  s.draw = () => {
    s.background(255);
    s.translate(sizeX() / 2, 0);
    s.fill(0);
    s.stroke(0);
    s.ellipse(0, 0, 10, 10);

    let cosA = Math.cos(angle);
    let sinA = Math.sin(angle);
    let a = gAccelaration * Math.sin(angle);
    speed += a;
    speed *= friction;
    angle += speed;

    console.log('a: ', a);
    console.log('v: ', speed);
    console.log('angle: ', angle);
    console.log('\n');

    let drawCos = Math.cos(angle - Math.PI / 2);
    let drawSin = Math.sin(angle - Math.PI / 2);
    s.strokeWeight(4);
    s.line(0, 0, drawCos * lineLength, drawSin * lineLength);
    s.ellipse(drawCos * lineLength, drawSin * lineLength, 10, 10);

    history.push({x: cosA, y: sinA, angle});
  };

  s.windowResized = () => {
    s.resizeCanvas(sizeX(), sizeY());
  };

};

const graph = s => {
  let canvas;

  s.setup = () => {
    canvas = s.createCanvas(sizeX(), sizeY());
    canvas.parent('graphCanvas');
    document.getElementById('defaultCanvas1').style.border = '4px solid black';
  };

  s.draw = () => {
    s.background(255);
    s.translate(0, sizeY() / 2);
    s.fill(0);
    s.stroke(0);

    for (let i = 0; i < history.length; i++) {
      if (i % 3 === 0) {
        s.ellipse(i, history[i].y * 100, 5, 5);
      }
    }

    if (history.length > 500) {
      history = history.slice(1, history.length);
    }
  };

  s.windowResized = () => {
    s.resizeCanvas(sizeX(), sizeY());
  };

};

let simulationP5 = new p5(simulation);
let graphP5 = new p5(graph);