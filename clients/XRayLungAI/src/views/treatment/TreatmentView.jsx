import React from "react";
import { useTreatmentController } from "../../controllers/treatment/useTreatmentController";

const TreatmentView = () => {
  const treatmentList = useTreatmentController();

  return (
    <div>
      <h2>Gợi ý điều trị</h2>
      {treatmentList.map((item, index) => (
        <div key={index}>
          <p><strong>Ảnh {index + 1}</strong></p>
          <p>Mức độ: {item.level}</p>
          <p>Lời khuyên: {item.suggestion}</p>
        </div>
      ))}
    </div>
  );
};

export default TreatmentView;
