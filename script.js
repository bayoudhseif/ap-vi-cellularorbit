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

    document.body.style.backgroundImage = "url('img/blur3.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundAttachment = "fixed";

    const svg = d3.select('#visualization').append('svg')
        .attr('width', '100%')
        .attr('height', '100vh');

    const width = document.body.clientWidth;
    const height = window.innerHeight;

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

    const sun = svg.append('image')
        .attr('xlink:href', 'img/sun4.png')
        .attr('width', 150)
        .attr('height', 150)
        .attr('x', width / 2 - 75)
        .attr('y', height / 2 - 75);

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

    shakeSun();
    setInterval(shakeSun, 6000);

    const tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.75)')
        .style('border-radius', '5px')
        .style('color', 'white')
        .style('display', 'none')
        .style('pointer-events', 'none');

    const imagePathForCallType = (call) => {
        switch (call.type) {
            case 'Friend': return 'img/aaa.png';
            case 'Family': return 'img/paper1.png';
            case 'Other': return 'img/aaat.png';
            default: return '';
        }
    };

    let speed = 1;

    calls.forEach((call, index) => {
        const orbitRadius = call.direction === 'incoming' ? 100 + index * 5 : 150 + index * 5;
        let angle = Math.random() * 2 * Math.PI;

        const x = width / 2 + orbitRadius * Math.cos(angle);
        const y = height / 2 + orbitRadius * Math.sin(angle);

        svg.append('circle')
            .attr('cx', width / 2)
            .attr('cy', height / 2)
            .attr('r', orbitRadius)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('stroke-dasharray', '3,3')
            .attr('stroke-opacity', 0.4);

        let size = call.duration * 10;
        let imageSize = Math.sqrt(size);

        const callClass = call.type.toLowerCase();
        const planetImage = svg.append('image')
            .attr('xlink:href', imagePathForCallType(call))
            .attr('class', `planet ${callClass} ${call.direction}`)
            .attr('width', imageSize)
            .attr('height', imageSize)
            .attr('x', x - imageSize / 2)
            .attr('y', y - imageSize / 2)
            .datum({ 
                type: call.type, 
                direction: call.direction, 
                status: call.status, 
                duration: call.duration 
            })
            
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

        const update = () => {
            let rotationSpeed = (1 / (call.duration * 10)) * speed;
            angle += call.direction === 'incoming' ? rotationSpeed : -rotationSpeed;
            const newX = width / 2 + orbitRadius * Math.cos(angle);
            const newY = height / 2 + orbitRadius * Math.sin(angle);
            planetImage.attr('x', newX - imageSize / 2).attr('y', newY - imageSize / 2);
        };

        setInterval(update, 15);
    });

    // Filter state initialization
let filterState = {
    friend: true,
    family: true,
    other: true,
    incoming: true,
    outgoing: true,
    answered: true,
    missed: true,
    duration: 120, // Assuming this is your initial duration filter value
};


    // Function to apply filters based on the current filter state
    function applyFilters() {
        d3.selectAll('.planet').style('display', function(d) {
            const categoryMatch = filterState[d.type.toLowerCase()];
            const directionMatch = filterState[d.direction];
            const durationMatch = d.duration <= filterState.duration;
            const statusMatch = filterState[d.status]; // This assumes your data's `status` property is either 'answered' or 'missed'
            return categoryMatch && directionMatch && durationMatch && statusMatch ? 'block' : 'none';
        });
    }
    
    

    // Function to update the filter state and apply filters
    function updateFilters() {
        // Update filter state based on checkboxes
        filterState.friend = document.getElementById('toggleFriend').checked;
        filterState.family = document.getElementById('toggleFamily').checked;
        filterState.other = document.getElementById('toggleOther').checked;
        filterState.incoming = document.getElementById('toggleIncoming').checked;
        filterState.outgoing = document.getElementById('toggleOutgoing').checked;

        // Update filter state based on the duration slider
        filterState.duration = parseInt(document.getElementById('durationSlider').value, 10);

        // Apply the updated filters
        applyFilters();

        // Update filter state based on call status toggles
    filterState.answered = document.getElementById('toggleAnswered').checked;
    filterState.missed = document.getElementById('toggleMissed').checked;

    // Apply the updated filters
    applyFilters();
    }

    // Attach event listeners for checkboxes
    document.getElementById('toggleFriend').addEventListener('change', updateFilters);
    document.getElementById('toggleFamily').addEventListener('change', updateFilters);
    document.getElementById('toggleOther').addEventListener('change', updateFilters);
    document.getElementById('toggleIncoming').addEventListener('change', updateFilters);
    document.getElementById('toggleOutgoing').addEventListener('change', updateFilters);
    document.getElementById('toggleAnswered').addEventListener('change', updateFilters);
document.getElementById('toggleMissed').addEventListener('change', updateFilters);


    // Attach event listener for the duration slider
    document.getElementById('durationSlider').addEventListener('input', function() {
        document.getElementById('durationValue').textContent = this.value;
        updateFilters();
    });

    // Apply filters on initial load
    applyFilters();


    // Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("infoButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// Variable to track the crazy mode state
let isCrazyMode = false;

// Event listener for the crazy mode toggle
document.getElementById('toggleCrazyMode').addEventListener('change', function() {
    isCrazyMode = this.checked;
    if(isCrazyMode) {
        // Apply crazy mode adjustments
        applyCrazyMode();
    } else {
        // Revert to normal mode
        location.reload(); // Simplest way to revert to normal behavior without adding complex logic
    }
});

function applyCrazyMode() {
    d3.selectAll('.planet').each(function() {
        const planet = d3.select(this);

        function crazyUpdate() {
            if (!isCrazyMode) return; // Stop if crazy mode is turned off

            // Random new position within the SVG bounds
            const newX = Math.random() * (width - 150); // Adjust based on maximum expected size
            const newY = Math.random() * (height - 150); // Adjust based on maximum expected size

            // Random new size within a reasonable range, e.g., between 10px and 100px
            const newSize = 10 + Math.random() * 90;

            planet
                .transition()
                .duration(() => 2000 + Math.random() * 3000) // Smooth transition with random duration
                .ease(d3.easeLinear)
                .attr('x', newX)
                .attr('y', newY)
                .attr('width', newSize)
                .attr('height', newSize)
                .on('end', crazyUpdate); // Repeat after each move
        }

        crazyUpdate(); // Start the crazy movement and resizing
    });
}







});
