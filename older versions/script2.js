document.addEventListener("DOMContentLoaded", function() {
    const values = [30, 30, 60, 30, 90, 30, 90, 30, 90, 120, 60, 90, 30, 120, 30];
    const zigzagIndices = [2,3,4,6,8,9,10,11,12,13];
    const triangleIndex = 2;
    const squareIndices = [6, 8, 9,1,1,12,13];
    const blackLineIndices = [2,4,6,7,8,9,11];
    const svgNS = "http://www.w3.org/2000/svg";
    const chartSize = 500;
    const circleRadius = 10;
    const endCircleRadius = 5;
    const centerX = chartSize / 2;
    const centerY = chartSize / 2;
    const zigzagAmplitude = 1;
    const zigzagSteps = 15;
  
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", chartSize);
    svg.setAttribute("height", chartSize);
    document.getElementById("chartContainer").appendChild(svg);
  
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", centerX);
    circle.setAttribute("cy", centerY);
    circle.setAttribute("r", circleRadius);
    circle.setAttribute("fill", "red");
    svg.appendChild(circle);
  
    function drawEndCircle(x, y, radius) {
      const endCircle = document.createElementNS(svgNS, "circle");
      endCircle.setAttribute("cx", x);
      endCircle.setAttribute("cy", y);
      endCircle.setAttribute("r", radius);
      endCircle.setAttribute("fill", "blue");
      svg.appendChild(endCircle);
    }
  
    function drawEndTriangle(x, y, angle) {
      const size = 10;
      const height = size * Math.sqrt(3) / 2;
      const direction = angle + Math.PI;
      const points = [
        `${x},${y}`,
        `${x + height * Math.cos(direction + Math.PI / 6)},${y + height * Math.sin(direction + Math.PI / 6)}`,
        `${x + height * Math.cos(direction - Math.PI / 6)},${y + height * Math.sin(direction - Math.PI / 6)}`,
      ].join(' ');
  
      const triangle = document.createElementNS(svgNS, "polygon");
      triangle.setAttribute("points", points);
      triangle.setAttribute("fill", "green");
      svg.appendChild(triangle);
    }
  
    function drawEndSquare(x, y, angle) {
      const size = 10;
      const square = document.createElementNS(svgNS, "rect");
      square.setAttribute("x", x - size / 2);
      square.setAttribute("y", y - size / 2);
      square.setAttribute("width", size);
      square.setAttribute("height", size);
      square.setAttribute("fill", "purple");
      square.setAttribute("transform", `rotate(45,${x},${y})`);
      svg.appendChild(square);
    }
  
    function drawZigzagLine(startX, startY, endX, endY, amplitude, steps, strokeColor = "blue") {
      const path = document.createElementNS(svgNS, "path");
      let d = `M ${startX} ${startY} `;
      const dx = endX - startX;
      const dy = endY - startY;
      const length = Math.sqrt(dx * dx + dy * dy);
      const stepLength = length / steps;
      const angle = Math.atan2(dy, dx);
  
      for (let i = 1; i <= steps; i++) {
        const normalX = amplitude * Math.cos(angle + Math.PI / 2);
        const normalY = amplitude * Math.sin(angle + Math.PI / 2);
        const side = i % 2 === 0 ? 1 : -1;
        const zigX = startX + Math.cos(angle) * stepLength * i + normalX * side;
        const zigY = startY + Math.sin(angle) * stepLength * i + normalY * side;
        d += `L ${zigX} ${zigY} `;
      }
  
      d += `L ${endX} ${endY}`;
      path.setAttribute("d", d);
      path.setAttribute("stroke", strokeColor);
      path.setAttribute("stroke-width", 2);
      path.setAttribute("fill", "none");
      svg.appendChild(path);
  
      drawEndCircle(endX, endY, endCircleRadius);
    }
  
    values.forEach((value, index) => {
      const angle = (index * 2 * Math.PI) / values.length;
      const lineLength = value;
      const endX = centerX + lineLength * Math.cos(angle);
      const endY = centerY + lineLength * Math.sin(angle);
      const isBlackLine = blackLineIndices.includes(index);
  
      if (index === triangleIndex) {
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", centerX);
        line.setAttribute("y1", centerY);
        line.setAttribute("x2", endX);
        line.setAttribute("y2", endY);
        line.setAttribute("stroke", isBlackLine ? "black" : "blue");
        line.setAttribute("stroke-width", 2);
        svg.appendChild(line);
        drawEndTriangle(endX, endY, angle);
      } else if (squareIndices.includes(index)) {
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", centerX);
        line.setAttribute("y1", centerY);
        line.setAttribute("x2", endX);
        line.setAttribute("y2", endY);
        line.setAttribute("stroke", isBlackLine ? "black" : "blue");
        line.setAttribute("stroke-width", 2);
        svg.appendChild(line);
        drawEndSquare(endX, endY, angle);
      } else if (zigzagIndices.includes(index)) {
        drawZigzagLine(centerX, centerY, endX, endY, zigzagAmplitude, zigzagSteps, isBlackLine ? "black" : "blue");
      } else {
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", centerX);
        line.setAttribute("y1", centerY);
        line.setAttribute("x2", endX);
        line.setAttribute("y2", endY);
        line.setAttribute("stroke", isBlackLine ? "black" : "blue");
        line.setAttribute("stroke-width", 2);
        svg.appendChild(line);
        drawEndCircle(endX, endY, endCircleRadius);
      }

      /* hover line effect start 
      // Function to create and return a line element
function createLine(x1, y1, x2, y2, strokeColor = "blue", strokeWidth = 2) {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", strokeColor);
    line.setAttribute("stroke-width", strokeWidth);
  
    // Add event listeners for hover effect
    line.addEventListener("mouseover", function() {
      line.setAttribute("stroke-width", strokeWidth * 2); // Make line thicker on hover
    });
    line.addEventListener("mouseout", function() {
      line.setAttribute("stroke-width", strokeWidth); // Revert to original thickness
    });
  
    return line;
  }
  
  // Update the section where lines are drawn to use the createLine function
  values.forEach((value, index) => {
    const angle = (index * 2 * Math.PI) / values.length;
    const lineLength = value;
    const endX = centerX + lineLength * Math.cos(angle);
    const endY = centerY + lineLength * Math.sin(angle);
    const isBlackLine = blackLineIndices.includes(index);
    const strokeColor = isBlackLine ? "black" : "blue";
    const strokeWidth = 2;
  
    let line;
    if (index === triangleIndex || squareIndices.includes(index) || zigzagIndices.includes(index) || true) { // Simplified for example
      line = createLine(centerX, centerY, endX, endY, strokeColor, strokeWidth);
      svg.appendChild(line);
    }
  
    // Additional logic for drawing triangles, squares, and handling zigzag lines as before
  });
    /* hover line effect end */

  

    });
  });
  