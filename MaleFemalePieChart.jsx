// import React, { useState, useEffect } from 'react';
// import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import * as am4core from '@amcharts/amcharts4/core';
// import * as am4charts from '@amcharts/amcharts4/charts';
// import am4themes_animated from '@amcharts/amcharts4/themes/animated';

// const MaleFemalePieChart = () => {
//   const [showMalePopup, setShowMalePopup] = useState(false);
//   const [showFemalePopup, setShowFemalePopup] = useState(false);

//   useEffect(() => {
//     // Initialize amCharts
//     am4core.useTheme(am4themes_animated);

//     // Create chart instance
//     const chart = am4core.create('maleFemaleChart', am4charts.PieChart);

//     // Add data
//     chart.data = [
//       { "category": "Male", "value": 770 },
//       { "category": "Female", "value": 509 },
//     ];

//     // Add and configure Series
//     const pieSeries = chart.series.push(new am4charts.PieSeries());
//     pieSeries.dataFields.value = 'value';
//     pieSeries.dataFields.category = 'category';

//     // Configure labels
//     pieSeries.labels.template.text = "{category}";
//     pieSeries.labels.template.disabled = false; // Enable labels
//     pieSeries.labels.template.fontSize = 24;

//     // Add event listeners for male and female sections
//     const handleSectionHover = (gender, setShowPopup) => {
//       pieSeries.slices.each(function(slice) {
//         if (slice.dataItem.dataContext.category === gender) {
//           slice.events.on('over', () => {
//             setShowPopup(true);
//           });
//           slice.events.on('out', () => {
//             setShowPopup(false);
//           });
//         }
//       });
//     };

//     handleSectionHover('Male', setShowMalePopup);
//     handleSectionHover('Female', setShowFemalePopup);

//     // Enable export
//     chart.exporting.menu = new am4core.ExportMenu();

//     // Cleanup on unmount
//     return () => {
//       chart.dispose();
//     };
//   }, []);

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <div style={{ marginRight: '30px' }}>
//         <Button variant="outlined" onClick={() => setShowFemalePopup(true)}>Show Female Data</Button>
//       </div>
//       <div id="maleFemaleChart" style={{ width: '50%', height: '500px', marginRight: '30px', marginLeft: '30px' }}></div>
//       <div style={{ marginLeft: '30px' }}>
//         <Button variant="outlined" onClick={() => setShowMalePopup(true)}>Show Male Data</Button>
//       </div>
//       <Dialog open={showMalePopup} onClose={() => setShowMalePopup(false)}>
//         <DialogTitle>Male Popup Title</DialogTitle>
//         <DialogContent>
//           <p>This is the content of the male popup window.</p>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowMalePopup(false)} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog open={showFemalePopup} onClose={() => setShowFemalePopup(false)}>
//         <DialogTitle>Female Popup Title</DialogTitle>
//         <DialogContent>
//           <p>This is the content of the female popup window.</p>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowFemalePopup(false)} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default MaleFemalePieChart;


import React, { useState, useEffect } from 'react';
import axios from "axios";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [male, setMale] = useState([]);
  const [female, setFemale] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const maleResponse = await axios.get("http://127.0.0.1:8000/api/male/");
        const femaleResponse = await axios.get("http://127.0.0.1:8000/api/female/");
        const monthlyResponse = await axios.get("http://127.0.0.1:8000/api/monthly-data");
        
        setMale(maleResponse.data);
        setFemale(femaleResponse.data);
        setMonthlyData(monthlyResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
    const pieSeries = pieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'value';
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

    // Enable export
    pieChart.exporting.menu = new am4core.ExportMenu();

    // Cleanup on unmount
    return () => {
      pieChart.dispose();
    };
  }, [male, female]);

  useEffect(() => {
    // Initialize amCharts
    am4core.useTheme(am4themes_animated);

    // Create bar chart instance
    const barChart = am4core.create('barChart', am4charts.XYChart);

    // const data = monthlyData.map(monthly => ({
    //   "month": monthly.month,
    //   "male": getMaleCount(monthly.month),
    //   "female": getFemaleCount(monthly.month)
    // }));

    // Add data
    const data = monthlyData.map(monthly => ({
      "month": monthly.month,
      "male": getMaleCount(monthly.month),
      "female": getFemaleCount(monthly.month)
    }));

    // Calculate total count for each month
    data.forEach((item) => {
      item.total = item.male + item.female;
    });

    // Set data
    barChart.data = data;

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

    // Enable export
    barChart.exporting.menu = new am4core.ExportMenu();

    // Cleanup on unmount
    return () => {
      barChart.dispose();
    };
  }, [monthlyData]); // Added monthlyData dependency

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

  const getMaleCount = (month) => {
    const dataForMonth = monthlyData.find(item => item.month === month);
    return dataForMonth ? dataForMonth.maleCount : 0;
  };

  const getFemaleCount = (month) => {
    const dataForMonth = monthlyData.find(item => item.month === month);
    return dataForMonth ? dataForMonth.femaleCount : 0;
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
              <ListItemText primary="Menu" />
            </ListItem>
            <ListItem button onClick={toggleDrawer}>
              <ListItemText primary="About us" />
            </ListItem>
            <ListItem button onClick={toggleDrawer}>
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
