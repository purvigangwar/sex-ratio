import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const BarChart = () => {
  useEffect(() => {
    // Initialize amCharts
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    const chart = am4core.create('chartdiv', am4charts.XYChart);

    // Add data
    chart.data = [
      { "month": "January", "count": 20 },
      { "month": "February", "count": 35 },
      { "month": "March", "count": 45 },
      { "month": "April", "count": 20 },
      { "month": "May", "count": 35 },
      { "month": "June", "count": 45 },
      { "month": "July", "count": 20 },
      { "month": "August", "count": 35 },
      { "month": "September", "count": 45 },
      { "month": "October", "count": 20 },
      { "month": "November", "count": 35 },
      { "month": "December", "count": 45 },
      // Add more data for other months
    ];

    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.minGridDistance = 100; // Adjust the spacing between categories

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "month";
    series.columns.template.strokeWidth = 0;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.columns.template.column.cornerRadiusTopLeft = 5;

    // Add labels
    const labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = "{value}";
    labelBullet.label.fontSize = 14;
    labelBullet.label.dy = -10;

    // Enable export
    chart.exporting.menu = new am4core.ExportMenu();

    // Cleanup on unmount
    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: '100%', height: '500px', marginTop: '100px' }}></div>;
};

export default BarChart;
