document.addEventListener("DOMContentLoaded", function () {
  // Select the canvas element
  const ctx = document.getElementById("attendanceChart").getContext("2d");

  // Define attendance data for each day
  const data = {
    labels: [
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Museum Attendance by Day",
        data: [350, 500, 480, 600, 670, 720],
        backgroundColor: [
          "rgba(83, 58, 113)",
          "rgba(97, 132, 216)",
          "rgba(80, 197, 183)",
          "rgba(156, 236, 91)",
          "rgba(153, 102, 255)",
          "rgba(240, 244, 101)",
        ],
      },
    ],
  };

  // Create the Polar Area chart
  new Chart(ctx, {
    type: "polarArea",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: "Museum Attendance by Day",
          font: {
            size: 26,
          },
        },
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 16,
            },
          },
        },
      },
      scales: {
        r: {
          ticks: {
            display: true,
            font: {
              size: 12,
            },
          },
        },
      },
    },
  });
});
