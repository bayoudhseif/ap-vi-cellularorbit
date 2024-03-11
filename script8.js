document.addEventListener('DOMContentLoaded', () => {
    const calls = [
        { type: 'Friend', direction: 'outgoing', status: 'missed', duration: 6 },
        { type: 'Friend', direction: 'outgoing', status: 'missed', duration: 1 },
        { type: 'Friend', direction: 'incoming', status: 'answered', duration: 17 },
        { type: 'Other', direction: 'outgoing', status: 'answered', duration: 13 },
        { type: 'Friend', direction: 'incoming', status: 'answered', duration: 58 },
        { type: 'Friend', direction: 'outgoing', status: 'missed', duration: 1 },
        { type: 'Family', direction: 'incoming', status: 'answered', duration: 60 },
        { type: 'Friend', direction: 'incoming', status: 'missed', duration: 1 },
        { type: 'Family', direction: 'incoming', status: 'answered', duration: 36 },
        { type: 'Family', direction: 'incoming', status: 'answered', duration: 120 },
        { type: 'Friend', direction: 'outgoing', status: 'answered', duration: 30 },
        { type: 'Family', direction: 'incoming', status: 'answered', duration: 60 },
        { type: 'Family', direction: 'outgoing', status: 'answered', duration: 3 },
        { type: 'Family', direction: 'outgoing', status: 'answered', duration: 120 },
        { type: 'Friend', direction: 'outgoing', status: 'missed', duration: 1 }
    ];

    

    const svg = d3.select('#visualization').append('svg')
        .attr('width', '100%')
        .attr('height', '100vh')
        .style('background-color', 'black')


    const width = document.body.clientWidth;
    const height = window.innerHeight;

    // Add stars to the background
    const numStars = 200;
    for (let i = 0; i < numStars; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        svg.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 1)
            .attr('fill', 'white');
    }

    const sun = svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', 50)
        .attr('fill', 'yellow')
        .attr('stroke', 'orange')
        .attr('stroke-width', 5);

    const tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.75)')
        .style('border-radius', '5px')
        .style('color', 'white')
        .style('display', 'none')
        .style('pointer-events', 'none');

    // Function to choose shape based on call type
    const shapeForCallType = (call) => {
        switch (call.type) {
            case 'Friend': return d3.symbolSquare;
            case 'Family': return d3.symbolCircle; // Use circle for Family calls
            case 'Other': return d3.symbolTriangle;
        }
    };

    // Calculate the minimum size for shapes
    const minSize = 0;

    calls.forEach((call, index) => {
        const orbitRadius = call.direction === 'incoming' ? 100 + index * 5 : 150 + index * 5;

        

        // Draw orbit line
        svg.append('circle')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', orbitRadius)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('stroke-dasharray', '3,3')
            .attr('stroke-opacity', 0.4);

        let angle = Math.random() * 2 * Math.PI;
        const rotationSpeed = 0.001; // Adjust rotation speed as needed

        const x = width / 2 + orbitRadius * Math.cos(angle);
        const y = height / 2 + orbitRadius * Math.sin(angle);

        // Determine the shape for each call
        let size = call.duration * 10; // Adjust size based on duration

        const symbol = d3.symbol().type(shapeForCallType(call)).size(size);

        const planet = svg.append('path')
            .attr('d', symbol())
            .attr('transform', `translate(${x}, ${y})`)
            .attr('fill', call.status === 'answered' ? 'lightgreen' : 'red')
            .attr('stroke', 'white')
            .attr('stroke-width', call.status === 'answered' ? 2 : 1)
            .datum({ angle }) // Attach call data including initial angle
            .on('mouseover', function(event, d) {
                tooltip
                    .html(`Type: ${call.type}<br>Direction: ${call.direction}<br>Status: ${call.status}<br>Duration: ${call.duration}s`)
                    .style('display', 'block')
                    .style('left', `${event.pageX + 20}px`)
                    .style('top', `${event.pageY}px`);
            })
            .on('mousemove', function(event) {
                tooltip
                    .style('left', `${event.pageX + 20}px`)
                    .style('top', `${event.pageY}px`);
            })
            .on('mouseout', function() {
                tooltip.style('display', 'none');
            });


            // Function to update planet position
const update = () => {
    let rotationSpeed = 1 / (call.duration * 10); // Adjust this multiplier to get the desired effect
    if (call.direction === 'incoming') {
        angle += rotationSpeed; // Clockwise for incoming calls
    } else if (call.direction === 'outgoing') {
        angle -= rotationSpeed; // Counter-clockwise for outgoing calls
    }
    const newX = width / 2 + orbitRadius * Math.cos(angle);
    const newY = height / 2 + orbitRadius * Math.sin(angle);
    planet.attr('transform', `translate(${newX}, ${newY})`);
};

// Start planet rotation
setInterval(update, 15);
    });

    
});
