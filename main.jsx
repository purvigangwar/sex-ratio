import React from 'react'
import ReactDOM from 'react-dom/client'
import Navbar from './Navbar.jsx'
import MaleFemalePieChart from './MaleFemalePieChart.jsx'
import BarChart from './Bar.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navbar />
    {/* <MaleFemalePieChart />
    <BarChart /> */}
  </React.StrictMode>,
)
