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

    const width = document.body.clientWidth; // Updated to ensure full width is used
    const height = window.innerHeight; // Updated for full height

    // Central Sun
    svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', 50) // Increased size for visibility
        .attr('fill', 'yellow')
        .attr('stroke', 'orange')
        .attr('stroke-width', 5);

    // Planets and Orbits
    calls.forEach((call, index) => {
        const orbitRadius = call.direction === 'incoming' ? 100 + index * 5 : 150 + index * 5; // Dynamic orbit radius
        const angle = Math.random() * 2 * Math.PI; // Randomize position on the orbit
        const x = width / 2 + orbitRadius * Math.cos(angle);
        const y = height / 2 + orbitRadius * Math.sin(angle);

        // Orbit Path
        svg.append('circle')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', orbitRadius)
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('stroke-dasharray', '2,2')
            .attr('stroke-opacity', 0.5);

        // Planet
        svg.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', call.duration / 10 + 5) // Size based on duration
            .attr('fill', call.status === 'answered' ? 'lightgreen' : 'red')
            .attr('stroke', 'white')
            .attr('stroke-width', call.status === 'answered' ? 2 : 1);
    });

    // Tooltip setup
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.75)')
        .style('border-radius', '5px')
        .style('color', 'white')
        .style('display', 'none');

        calls.forEach((call, index) => {
            // Orbit and Planet creation code remains the same
    
            // Planet with data binding
            svg.append('circle')
                .datum(call) // Bind the full call data to the circle
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', call.duration / 10 + 5) // Adjusted for visibility
                .attr('fill', call.status === 'answered' ? 'lightgreen' : 'red')
                .attr('stroke', 'white')
                .attr('stroke-width', call.status === 'answered' ? 2 : 1)
                .on('mouseover', function(event, d) {
                    tooltip.style('display', 'block')
                           .html(`Type: ${d.type}<br>Direction: ${d.direction}<br>Status: ${d.status}<br>Duration: ${d.duration}s`)
                           .style('left', `${event.pageX + 10}px`)
                           .style('top', `${event.pageY + 10}px`);
                })
                .on('mouseout', function() {
                    tooltip.style('display', 'none');
                });
        });

    svg.selectAll('circle:not(:first-child)').on('mouseover', function(event, d) {
        tooltip.style('display', 'block')
               .html(`Type: ${d.type}<br>Status: ${d.status}<br>Duration: ${d.duration}s`)
               .style('left', `${event.pageX + 20}px`)
               .style('top', `${event.pageY + 20}px`);
    }).on('mouseout', function() {
        tooltip.style('display', 'none');
    });

    // Additional features like animations, interactive legends, and filtering could be added here.
});
