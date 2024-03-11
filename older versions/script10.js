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
        .style('background-color', 'black');

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

    // Add sun to the center
    /*
    svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', 50)
        .attr('fill', 'yellow')
        .attr('stroke', 'orange')
        .attr('stroke-width', 5);
        */

        svg.append('foreignObject')
    .attr('width', 300) // adjust as needed
    .attr('height', 300) // adjust as needed
    .attr('x', width / 2 - 150) // adjust as needed
    .attr('y', height / 2 - 150) // adjust as needed
    .html(`<video width="300" height="300" autoplay loop muted>
            <source src="img/sundemo3.mp4" type="video/mp4">
           </video>`);

    // Add tooltip
    const tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.75)')
        .style('border-radius', '5px')
        .style('color', 'white')
        .style('display', 'none')
        .style('pointer-events', 'none');

    // Function to choose image path based on call type
    const imagePathForCallType = (call) => {
        switch (call.type) {
            case 'Friend': return 'img/paper2.png'; // Path for Friend calls
            case 'Family': return 'img/paper1.png'; // Path for Family calls
            case 'Other': return 'img/paper3.png'; // Path for Other calls
        }
    };

    calls.forEach((call, index) => {
        const orbitRadius = call.direction === 'incoming' ? 100 + index * 5 : 150 + index * 5;
        let angle = Math.random() * 2 * Math.PI;

        const x = width / 2 + orbitRadius * Math.cos(angle);
        const y = height / 2 + orbitRadius * Math.sin(angle);

        // Draw orbit line
        svg.append('circle')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', orbitRadius)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('stroke-dasharray', '3,3')
            .attr('stroke-opacity', 0.4);

        // Determine the image for each call
        let size = call.duration * 10; // Adjust size based on duration
        let imageSize = Math.sqrt(size); // Convert area size to linear size for setting image width/height

        // Append image instead of path for planet representation
        const planetImage = svg.append('image')
            .attr('xlink:href', imagePathForCallType(call))
            .attr('width', imageSize) // Set image size
            .attr('height', imageSize) // Set image size
            .attr('x', x - imageSize / 2) // Adjust x to center image
            .attr('y', y - imageSize / 2) // Adjust y to center image
            .datum({ angle }) // Attach call data including initial angle
            .on('mouseover', function(event, d) {
                tooltip
                    .html(`Type: ${call.type}<br>Direction: ${call.direction}<br>Status: ${call.status}<br>Duration: ${call.duration}s`)
                    .style('display', 'block')
                    .style('left', `${event.pageX + 20}px`)
                    .style('top', `${event.pageY}px`);
                speed = 0.1;
            })
            .on('mousemove', function(event) {
                tooltip
                    .style('left', `${event.pageX + 20}px`)
                    .style('top', `${event.pageY}px`);
            })
            .on('mouseout', function() {
                tooltip.style('display', 'none');
                speed = 1;
            });

        // Function to update planet position
        const update = () => {
            let rotationSpeed = (1 / (call.duration * 10)) * speed; // Adjust this multiplier to get the desired effect
            if (call.direction === 'incoming') {
                angle += rotationSpeed; // Clockwise for incoming calls
            } else if (call.direction === 'outgoing') {
                angle -= rotationSpeed; // Counter-clockwise for outgoing calls
            }
            const newX = width / 2 + orbitRadius * Math.cos(angle);
            const newY = height / 2 + orbitRadius * Math.sin(angle);
            planetImage.attr('x', newX - imageSize / 2).attr('y', newY - imageSize / 2); // Update image position
        };

        // Start planet rotation
        setInterval(update, 15);
    });
});
