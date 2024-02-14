import React from "react"
import ReactApexChart from "react-apexcharts"

const ExamScoreChart1 = () => {
  const series = [
    {
      data: [89, 85, 80, 67, 89],
    },
  ]
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
      },
    },
    dataLabels: {
      enabled: false,
    },

    colors: ["#34c38f"],
    grid: {
      borderColor: "#f1f1f1",
    },
    xaxis: {
      categories: [
        "Subject 1",
        "Subject 2",
        "Subject 3",
        "Subject 4",
        "Subject 5",
      ],
    },
  }

  return (
    <ReactApexChart options={options} series={series} type="bar" height="350" />
  )
}

export default ExamScoreChart1
