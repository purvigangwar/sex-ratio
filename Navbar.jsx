import React, { useState, useEffect } from 'react';
import axios from "axios";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, Info as InfoIcon, ContactMail as ContactIcon } from '@mui/icons-material'; // Import icons
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [male, setMale] = useState([]);
  const [female, setFemale] = useState([]);
  const [data, setData] = useState([]); 

  useEffect(() => {
    const getAllGender = async () => {
      try {
        const maleResponse = await axios.get("http://127.0.0.1:8000/api/male/");
        const femaleResponse = await axios.get("http://127.0.0.1:8000/api/female/");
        const response = await axios.get("http://127.0.0.1:8000/api/get_monthly_data/");
        setData(response.data);
        setMale(maleResponse.data);
        setFemale(femaleResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllGender();
  }, []);

  useEffect(() => {
    // Initialize amCharts
    am4core.useTheme(am4themes_animated);

    // Create pie chart instance
    const pieChart = am4core.create('maleFemaleChart', am4charts.PieChart);

    // Add data
    pieChart.data = [
      { "category": "Male", "value": male.length },
      { "category": "Female", "value": female.length },
    ];

    // Add and configure Pie Series
    const pieSeries = pieChart.series.push(new am4charts.PieSeries());             //adds a new pie series to the chart and assigns it to the pieSeries variable.
    pieSeries.dataFields.value = 'value';                             //  how the data from the data array is mapped to the pie chart.
    pieSeries.dataFields.category = 'category';

    // Disable slice selection
    pieSeries.slices.template.events.disableType("hit");

    // Disable percentage labels
    pieSeries.labels.template.text = "{category}"; // Show only category labels
    pieSeries.labels.template.disabled = false; // Enable category labels

    // Add event listeners for male and female sections
    pieSeries.slices.template.events.on('hit', (event) => {
      setSelectedGender(event.target.dataItem.category);
    });

    // // Enable export
    // pieChart.exporting.menu = new am4core.ExportMenu();

    // Cleanup on unmount
    return () => {
      pieChart.dispose();           //properly disposes of the amCharts chart instance to avoid memory leaks and potential issues.
    };
  }, [male, female]);

  
  // const [data, setData] = useState([]); 

  // useEffect(() => {
  //   // Fetch data from your Django backend API
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("http://127.0.0.1:8000/api/get_monthly_data/");
  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData(); // Call the fetchData function when the component mounts
  // }, []);

  useEffect(() => {
    // Initialize amCharts
    am4core.useTheme(am4themes_animated);

    // Create bar chart instance
    const barChart = am4core.create('barChart', am4charts.XYChart);

    // Transform the data to the format expected by amCharts
    const transformedData = data.map(item => ({
        month: item.month,
        male: item.male,
        female: item.female,
        total: item.male + item.female
    }));

    // Set data
    barChart.data = transformedData;

    // Create axes
    const categoryAxis = barChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.minGridDistance = 10; // Adjust the spacing between categories
    categoryAxis.title.text = "Month"; // X-axis label
    categoryAxis.title.fontSize = 20; // Increase font size
    categoryAxis.title.fontWeight = 'bold'; // Make it bold

    const valueAxis = barChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Count"; // Y-axis label
    valueAxis.title.fontSize = 20; // Increase font size
    valueAxis.title.fontWeight = 'bold'; // Make it bold

    // Create series
    const series = barChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "total";
    series.dataFields.categoryX = "month";
    series.columns.template.strokeWidth = 0;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.columns.template.column.cornerRadiusTopLeft = 5;
    series.columns.template.tooltipText = "Male - {male}\n Female - {female}\n Total - {total}";
                                                                      //It allows you to provide additional information related to the data point represented by the hovered element
    // Enable export
    // barChart.exporting.menu = new am4core.ExportMenu();

    // Cleanup on unmount
    return () => {
      barChart.dispose();
    };
}, [data]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const closeDialog = () => {
    setSelectedGender(null);
  };

  // Function to format date
  const formatDate = (dateString) => {
    // Parse the date string to create a Date object
    const date = new Date(dateString);
  
    // Get the day, month, and year components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed months
    const year = date.getFullYear();
  
    // Pad single-digit day and month with leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
  
    // Return the formatted date in dd-mm-yyyy format
    return `${formattedDay}-${formattedMonth}-${year}`;
  };

  return (
    <div>
      <AppBar position="fixed" style={{ background: '#2196f3' }}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <div>
            {/* Your logo */}
            <img 
              src="/src/assets/images.png" 
              alt="Logo"
              style={{ height: '50px', borderRadius: '50%' }}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer 
        anchor="left" 
        open={isDrawerOpen} 
        onClose={closeDrawer}
      >
        <div style={{ width: '250px' }}>
          <div style={{ textAlign: 'right', padding: '10px' }}>
            <IconButton onClick={closeDrawer}>
              <MenuIcon />
            </IconButton>
          </div>
          <List style={{ paddingTop: '30px', paddingLeft: '10px', paddingBottom: '20px' }}>
            <ListItem button onClick={toggleDrawer}>
              <ListItemIcon>
                <HomeIcon /> {/* Add the Home icon */}
              </ListItemIcon>
              <ListItemText primary="Menu" />
            </ListItem>
            <ListItem button onClick={toggleDrawer}>
              <ListItemIcon>
                <InfoIcon /> {/* Add the Info icon */}
              </ListItemIcon>
              <ListItemText primary="About us" />
            </ListItem>
            <ListItem button onClick={toggleDrawer}>
              <ListItemIcon>
                <ContactIcon /> {/* Add the Contact icon */}
              </ListItemIcon>
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
        <div style={{ width: '50%', marginRight: '10px' }}>
          <div id="maleFemaleChart" style={{ height: '500px' }}></div>
          <Dialog open={selectedGender !== null} onClose={closeDialog}>
            <DialogTitle>{selectedGender === 'Male' ? 'Male Info' : 'Female Info'}</DialogTitle>
            <DialogContent>
              {/* Use Table component to display user info */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>User ID</TableCell>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Sex</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>Job Title</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Map over the data and display each user */}
                    {selectedGender === 'Male' ? 
                      male.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.user_id}</TableCell>
                          <TableCell>{row.first_name}</TableCell>
                          <TableCell>{row.last_name}</TableCell>
                          <TableCell>{row.sex}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.phone}</TableCell>
                          <TableCell>{formatDate(row.date_of_birth)}</TableCell> {/* Increase font size */}
                          <TableCell>{row.job_title}</TableCell>
                        </TableRow>
                      )) : 
                      female.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.user_id}</TableCell>
                          <TableCell>{row.first_name}</TableCell>
                          <TableCell>{row.last_name}</TableCell>
                          <TableCell>{row.sex}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.phone}</TableCell>
                          <TableCell>{formatDate(row.date_of_birth)}</TableCell> {/* Increase font size */}
                          <TableCell>{row.job_title}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div style={{ width: '50%' }}>
          <div id="barChart" style={{ height: '400px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
