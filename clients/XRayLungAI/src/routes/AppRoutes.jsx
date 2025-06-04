import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroView from '../views/intro/IntroView';
import LoginView from '../views/login/LoginView';
import UploadView from '../views/upload/UploadView';
import DetectionView from '../views/detection/DetectionView';
import SegmentationView from '../views/segmentation/SegmentationView';
import SeverityView from '../views/severity/SeverityView';
import TreatmentView from '../views/treatment/TreatmentView';
import ReportView from '../views/report/ReportView';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import MyReportView from '../views/myreport/MyReportView';
import Pneumonia_chat from '../views/chatbot/Pneumonia_chat';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroView />} />
        <Route path="/login" element={<LoginView />} />

        {/* Main layout route wrapper */}
        <Route path="/home" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<UploadView />} />
          <Route path="detection" element={<DetectionView />} />
          <Route path="segmentation" element={<SegmentationView />} />
          <Route path="severity" element={<SeverityView />} />
          <Route path="treatment" element={<TreatmentView />} />
          <Route path="report" element={<ReportView />} />
          <Route path="my-reports" element={<MyReportView />} />
          <Route path="chatbot" element={<Pneumonia_chat />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
