// import React from 'react'
import Header from './component/Header'
import RegisterDoctor from './pages/RegisterDoctor'
import RegisterPatient from './pages/RegisterPatient'
import "./config/connection"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MedicalRecord from './pages/MedicalRecord'
import About from './pages/About'
import CustomerRelate from './pages/CustomerRelate'
import BookAppointment from './pages/BookAppointment'
import GetAllDoctors from './pages/GetAllDoctors'
import AllPatients from './pages/AllPatientRecord'
import DoctorDashboard from './pages/DoctorDashbord'
import PatientDashboard from './pages/PatientDashboard'



const App = () => {

  return (
    <div> 
    

      <Header/>
        <Routes>
         <Route path="/" element={<Home/>} /> 
      
         <Route path='/doctor' element={ <RegisterDoctor/>}/>
         <Route path='/patient' element={ <RegisterPatient/>} />
         <Route path='/medical' element={ <MedicalRecord/>} />
         <Route path='/customer' element={ <CustomerRelate/>} />
         <Route path='/booking' element={ <BookAppointment/>} />
         <Route path='/doctor-list' element={ <GetAllDoctors />} />
         <Route path='/allPatient' element={ <AllPatients />} />
         <Route path='/about' element={ <About />} />


         <Route path='/doctor-dashboard' element={ <DoctorDashboard/>} />

         <Route path='/patient-view' element={ <PatientDashboard/>} />


         
      
      </Routes> 
                    <ToastContainer theme="dark" position="bottom-center" /> 


       </div>
         )
       }
       
       export default App