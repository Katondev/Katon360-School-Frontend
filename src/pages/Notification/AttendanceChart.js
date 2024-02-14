import React from "react"
import ReactApexChart from "react-apexcharts"

const AttendanceChart = () => {
  const series = [
    {
      name: "Total",
      data: [27, 28, 27, 26, 25, 26, 29, 27, 30, 28, 30, 29],
    },
    {
      name: "Present",
      data: [25, 25, 24, 26, 25, 25, 28, 27, 29, 26, 27, 29],
    },
    {
      name: "Absent",
      data: [2, 3, 3, 0, 0, 0, 1, 0, 1, 2, 3, 0],
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
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    colors: ["#556ee6", "#34c38f", "#f46a6a"],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: "Days",
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " Days"
        },
      },
    },
  }

  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  )
}

export default AttendanceChart
