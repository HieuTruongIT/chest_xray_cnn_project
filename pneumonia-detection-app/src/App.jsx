import React, { useState } from 'react';
import TabNavigation from './components/navigation/TabNavigation';
import UploadForm from './components/upload/UploadForm';
import ClassificationView from './views/classification/ClassificationView';
import BoundingBoxView from './views/boundingBox/BoundingBoxView';
import SeverityView from './views/severity/SeverityView';
import TreatmentView from './views/treatment/TreatmentView';
import ReportView from './views/report/ReportView';

export default function App() {
  const [currentTab, setCurrentTab] = useState('Upload');

  return (
    <div className="p-4">
      <TabNavigation currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="mt-4">
        {currentTab === 'Upload' && <UploadForm />}
        {currentTab === 'Classification' && <ClassificationView />}
        {currentTab === 'Bounding Box' && <BoundingBoxView />}
        {currentTab === 'Severity' && <SeverityView />}
        {currentTab === 'Recommendation' && <TreatmentView />}
        {currentTab === 'Report' && <ReportView />}
      </div>
    </div>
  );
}
