// Wait for the document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Define an array of call data
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

    document.body.style.backgroundImage = "url('img/blur3.png')";
    
    // To make the background image cover the entire body without repeating
    document.body.style.backgroundSize = "cover";
    
    // To fix the background image and prevent it from scrolling with the content
    document.body.style.backgroundAttachment = "fixed";

    // Initialize SVG for visualization with full screen dimensions and black background
    const svg = d3.select('#visualization').append('svg')
        .attr('width', '100%')
        .attr('height', '100vh')
        //.style('background-color', 'black');

    // Determine the full width and height of the browser window
    const width = document.body.clientWidth;
    const height = window.innerHeight;

    // Add stars to the SVG background to simulate a night sky
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

    // Append an image of the sun to the SVG and position it in the center
    const sun = svg.append('image')
        .attr('xlink:href', 'img/sun4.png')
        .attr('width', 150)
        .attr('height', 150)
        .attr('x', width / 2 - 75)
        .attr('y', height / 2 - 75);

    // Define a function to make the sun image "shake" or vibrate
    const shakeSun = () => {
        sun.transition()
            .duration(2000)
            .ease(d3.easeSin)
            .attr('y', height / 2 - 75 + 10)
            .transition()
            .duration(2000)
            .ease(d3.easeSin)
            .attr('y', height / 2 - 75 - 10)
            .transition()
            .duration(2000)
            .ease(d3.easeSin)
            .attr('y', height / 2 - 75);
    };

    // Trigger the sun shaking immediately and repeat every 6 seconds
    shakeSun();
    setInterval(shakeSun, 6000);

    // Add a tooltip for displaying call information on hover
    const tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.75)')
        .style('border-radius', '5px')
        .style('color', 'white')
        .style('display', 'none')
        .style('pointer-events', 'none');

    // Function to return the image path based on the type of call
    const imagePathForCallType = (call) => {
        switch (call.type) {
            case 'Friend': return 'img/aaa.png';
            case 'Family': return 'img/paper1.png';
            case 'Other': return 'img/aaat.png';
            default: return ''; // Provide a default case for safety
        }
    };

    // Initialize speed variable for controlling animation speed
    let speed = 1;

    // Process each call in the data array
    calls.forEach((call, index) => {
        // Calculate the orbit radius based on call direction and index
        const orbitRadius = call.direction === 'incoming' ? 100 + index * 5 : 150 + index * 5;
        let angle = Math.random() * 2 * Math.PI; // Random starting angle

        // Calculate initial position of the call icon
        const x = width / 2 + orbitRadius * Math.cos(angle);
        const y = height / 2 + orbitRadius * Math.sin(angle);

        // Draw a dashed circle to represent the orbit of the call icon
        svg.append('circle')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', orbitRadius)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('stroke-dasharray', '3,3')
            .attr('stroke-opacity', 0.4);

        // Determine the size of the call icon based on call duration
        let size = call.duration * 10; // Use duration to scale size
        let imageSize = Math.sqrt(size); // Adjust image size proportionally

        // Append the call icon to the SVG
        const planetImage = svg.append('image')
            .attr('xlink:href', imagePathForCallType(call))
            .attr('width', imageSize)
            .attr('height', imageSize)
            .attr('x', x - imageSize / 2)
            .attr('y', y - imageSize / 2)
            .datum({ angle }) // Store the initial angle for rotation calculations
            // Display tooltip on mouseover
            .on('mouseover', function(event, d) {
                tooltip
                    .html(`Type: ${call.type}<br>Direction: ${call.direction}<br>Status: ${call.status}<br>Duration: ${call.duration}s`)
                    .style('display', 'block')
                    .style('left', `${event.pageX + 20}px`)
                    .style('top', `${event.pageY}px`);
                speed = 0.1; // Slow down rotation speed on hover
            })
            // Update tooltip position on mousemove
            .on('mousemove', function(event) {
                tooltip
                    .style('left', `${event.pageX + 20}px`)
                    .style('top', `${event.pageY}px`);
            })
            // Hide tooltip and reset rotation speed on mouseout
            .on('mouseout', function() {
                tooltip.style('display', 'none');
                speed = 1;
            });

        // Function to update call icon position for rotation effect
        const update = () => {
            let rotationSpeed = (1 / (call.duration * 10)) * speed; // Adjust rotation speed based on call duration
            angle += call.direction === 'incoming' ? rotationSpeed : -rotationSpeed; // Direction affects rotation direction
            const newX = width / 2 + orbitRadius * Math.cos(angle);
            const newY = height / 2 + orbitRadius * Math.sin(angle);
            planetImage.attr('x', newX - imageSize / 2).attr('y', newY - imageSize / 2); // Update position
        };

        // Continuously update call icon position for rotation effect
        setInterval(update, 15);
    });
});
