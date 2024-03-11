document.addEventListener('DOMContentLoaded', () => {
    const calls = [
        {type: 'Friend', direction: 'outgoing', status: 'missed', duration: 6},
        {type: 'Friend', direction: 'outgoing', status: 'missed', duration: 1},
        {type: 'Friend', direction: 'incoming', status: 'answered', duration: 17},
        {type: 'Other', direction: 'outgoing', status: 'answered', duration: 13},
        {type: 'Friend', direction: 'incoming', status: 'answered', duration: 58},
        {type: 'Friend', direction: 'outgoing', status: 'missed', duration: 1},
        {type: 'Family', direction: 'incoming', status: 'answered', duration: 60},
        {type: 'Friend', direction: 'incoming', status: 'missed', duration: 1},
        {type: 'Family', direction: 'incoming', status: 'answered', duration: 36},
        {type: 'Family', direction: 'incoming', status: 'answered', duration: 120},
        {type: 'Friend', direction: 'outgoing', status: 'answered', duration: 30},
        {type: 'Family', direction: 'incoming', status: 'answered', duration: 60},
        {type: 'Family', direction: 'outgoing', status: 'answered', duration: 3},
        {type: 'Family', direction: 'outgoing', status: 'answered', duration: 120},
        {type: 'Friend', direction: 'outgoing', status: 'missed', duration: 1}
    ];

    const svg = d3.select('#visualization').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute'); // Ensure SVG can be moved

    const width = document.getElementById('visualization').clientWidth;
    const height = document.getElementById('visualization').clientHeight;

    // Scaling and positioning configurations
    const radiusScale = d3.scaleSqrt().domain([1, 120]).range([10, 50]);
    const colorScale = d3.scaleOrdinal().domain(['answered', 'missed']).range(['green', 'red']);
    const typeScale = d3.scaleOrdinal().domain(['Friend', 'Family', 'Other']).range(['#1f77b4', '#ff7f0e', '#2ca02c']);
    const yPosition = {'Friend': height / 4, 'Family': height / 2, 'Other': 3 * height / 4};
    const symbolScale = d3.scaleOrdinal().domain(['incoming', 'outgoing']).range([d3.symbolCircle, d3.symbolTriangle]);

    const tooltip = d3.select('#tooltip');

    calls.forEach((call, i) => {
        const symbol = d3.symbol().type(symbolScale(call.direction)).size(radiusScale(call.duration) * 100);
        
        svg.append('path')
            .attr('d', symbol())
            .attr('transform', `translate(${(i + 1) * (width / (calls.length + 1))}, ${yPosition[call.type]})`)
            .attr('fill', typeScale(call.type))
            .attr('stroke', colorScale(call.status))
            .attr('stroke-width', 4)
            .on('mouseover', function(event, d) {
                tooltip.style('display', 'block')
                       .html(`Type: ${call.type}<br>Direction: ${call.direction}<br>Status: ${call.status}<br>Duration: ${call.duration}s`)
                       .style('left', `${event.pageX + 10}px`)
                       .style('top', `${event.pageY + 10}px`);
            })
            .on('mouseout', function() {
                tooltip.style('display', 'none');
            });
    });

    // Space hover effect
    const visualization = document.getElementById('visualization');
    visualization.addEventListener('mousemove', function(event) {
        const { clientWidth, clientHeight } = visualization;
        const mouseX = event.clientX - (clientWidth / 2);
        const mouseY = event.clientY - (clientHeight / 2);

        const shiftX = mouseX * 0.05; // Sensitivity of movement can be adjusted here
        const shiftY = mouseY * 0.05;

        svg.style('transform', `translate(${shiftX}px, ${shiftY}px)`);
    });
});
