document.addEventListener('DOMContentLoaded', function() {
    const calls = [
        { type: 'Friend', direction: 'outgoing', status: 'missed', duration: 6 },
        { type: 'Friend', direction: 'incoming', status: 'answered', duration: 17 },
        // Add the rest of your data here...
    ];

    const garden = document.getElementById('garden');

    calls.forEach(call => {
        const flower = document.createElement('div');
        flower.classList.add('flower', call.type.toLowerCase(), call.direction, call.status);
        flower.style.transform = `scale(${Math.log2(call.duration + 1) / 2})`; // Log scale for size
        flower.textContent = `${call.duration}s`; // Display call duration inside the flower
        garden.appendChild(flower);
    });
});
