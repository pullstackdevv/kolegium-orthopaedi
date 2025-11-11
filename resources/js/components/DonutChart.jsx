import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';

export default function DonutChart({ data, colors, centerText, size = 180 }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      Highcharts.chart(chartRef.current, {
        chart: {
          type: 'pie',
          height: size,
          width: size,
          backgroundColor: 'transparent',
          margin: [0, 0, 0, 0],
          spacing: [0, 0, 0, 0]
        },
        title: {
          text: centerText,
          align: 'center',
          verticalAlign: 'middle',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1f2937'
          },
          y: 5
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          pie: {
            innerSize: '70%',
            dataLabels: {
              enabled: false
            },
            enableMouseTracking: true,
            states: {
              hover: {
                brightness: 0.1
              }
            }
          }
        },
        series: [{
          name: 'Persentase',
          colorByPoint: true,
          data: data.map((item, index) => ({
            name: item.name,
            y: item.value,
            color: colors[index % colors.length]
          }))
        }]
      });
    }
  }, [data, colors, centerText, size]);

  return <div ref={chartRef} />;
}
