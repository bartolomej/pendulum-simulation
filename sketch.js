const sizeX = () => window.innerWidth / 2;
const sizeY = () => window.innerHeight / 2;

let history = [];

const simulation = s => {
  let canvas;
  let size = 300;
  let g = 9;
  let t = 0;

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

    let cosT = Math.cos(t);
    let sinT = Math.sin(t);

    s.strokeWeight(4);
    s.line(0, 0, cosT * size, sinT * size);
    s.ellipse(cosT * size, sinT * size, 10, 10);

    history.push({x: cosT, y: sinT, t});
    t += 0.01;
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