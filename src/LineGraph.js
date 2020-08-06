import React, {useState, useEffect} from 'react'
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const casesTypeColors = {
    cases:{
        rgb: 'rgba(204,16,52,0.6)',
        border: 'darkred'
    },
    recovered:{
        rgb: 'rgba(125,215,29,0.6)',
        border: 'green'
    },
    deaths:{
        rgb: 'rgba(251,68,67,0.6)',
        border: 'red'
    }
}

const options = {
    legend: {
        display: false,
    },
    elements: {
        points: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/yy",
                    tooltipFormat:"",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    }
}

function LineGraph({casesType = 'cases', ...props}) {
    const [data, setData] = useState({});

    useEffect(() =>{
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then(response => response.json())
                .then(data => {
                    const chartData = buildChartData(data, casesType);
                    setData(chartData);
                });
        };
        fetchData();
    },[casesType])

    const buildChartData = (data, casesType ="cases") => {
        const chartData = [];
        let lastDataPoint;
        for(let date in data[casesType]) {
            if (lastDataPoint){
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];

        }
        return chartData
    }
    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line 
                    options={options}
                    data={{
                        datasets: [
                            {
                            backgroundColor: casesTypeColors[casesType].rgb,
                            borderColor: casesTypeColors[casesType].border,
                            data:data,
                            },
                        ],
                    }} 
                />
            )}   
        </div>
    )
}

export default LineGraph
