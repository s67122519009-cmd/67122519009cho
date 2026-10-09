let chart;

const form = document.getElementById('inputForm');
const uInput = document.getElementById('u');
const aInput = document.getElementById('a');
const timeInput = document.getElementById('t');
const intervalInput = document.getElementById('interval');
const displacementOutput = document.getElementById('displacement');
const teal = '#35b8bd';
const highlight = '#f05a47';

function calculateAndPlot() {
    const u = Number(uInput.value);
    const a = Number(aInput.value);
    const selectedTime = Number(timeInput.value);
    const intervals = Number(intervalInput.value);
    const endTime = selectedTime * 2;

    displacementOutput.value = (u * selectedTime + 0.5 * a * selectedTime ** 2).toFixed(2);

    const data = Array.from({ length: intervals + 1 }, (_, index) => {
        const time = (endTime / intervals) * index;
        return {
            x: time,
            y: u * time + 0.5 * a * time ** 2
        };
    });
    const pointColors = data.map(point => Math.abs(point.x - selectedTime) < Number.EPSILON * endTime * 8 ? highlight : teal);

    if (chart) {
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].pointBackgroundColor = pointColors;
        chart.options.scales.x.max = endTime;
        chart.update();
        return;
    }

    const context = document.getElementById('myChart').getContext('2d');
    chart = new Chart(context, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 's = ut + (1/2)at²',
                data,
                backgroundColor: teal,
                borderColor: teal,
                pointBackgroundColor: pointColors,
                pointBorderColor: pointColors,
                pointRadius: 4,
                pointHoverRadius: 6,
                showLine: true,
                fill: false,
                borderWidth: 2,
                tension: 0.25
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 350
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: context => `t = ${context.parsed.x.toFixed(2)} s, s = ${context.parsed.y.toFixed(2)} m`
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: endTime,
                    title: {
                        display: true,
                        text: 'Time (s)'
                    },
                    grid: {
                        color: 'rgba(24, 45, 65, 0.08)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Displacement (m)'
                    },
                    grid: {
                        color: 'rgba(24, 45, 65, 0.08)'
                    }
                }
            }
        }
    });
}

form.addEventListener('submit', event => {
    event.preventDefault();
    calculateAndPlot();
});

calculateAndPlot();