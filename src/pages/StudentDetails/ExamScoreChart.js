import React from "react"
import ReactApexChart from "react-apexcharts"

const ExamScoreChart = () => {
  const series = [89, 70, 67, 83]
  const options = {
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
            formatter: function(val) {
              return val;
            }
          },
          total: {
            show: true,
            label: "Total",
            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return 100
            },
          },
        },
      },
    },

    labels: ["Subject 1", "Subject 2", "Subject 3", "Subject 4"],
    colors: ["#556ee6", "#34c38f", "#f46a6a", "#f1b44c"],
  }

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="radialBar"
      height="388"
      
    />
  )
}

export default ExamScoreChart
