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

    svg.append('circle')
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

    // Adding back the orbit lines
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

        const angle = Math.random() * 2 * Math.PI;
        const x = width / 2 + orbitRadius * Math.cos(angle);
        const y = height / 2 + orbitRadius * Math.sin(angle);

        svg.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', call.duration / 10 + 5)
            .attr('fill', call.status === 'answered' ? 'lightgreen' : 'red')
            .attr('stroke', 'white')
            .attr('stroke-width', call.status === 'answered' ? 2 : 1)
            .datum(call)
            .on('mouseover', function(event, d) {
                tooltip
                    .html(`Type: ${d.type}<br>Direction: ${d.direction}<br>Status: ${d.status}<br>Duration: ${d.duration}s`)
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
    });
});
