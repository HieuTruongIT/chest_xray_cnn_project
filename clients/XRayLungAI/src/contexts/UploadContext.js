import React, { createContext, useState } from "react";

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const addFiles = (newFiles, source = "Local") => {
    const newFileData = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      source,
    }));
    setFiles((prev) => [...prev, ...newFileData]);
    setPreviewImages((prev) => [...prev, ...newFileData.map(f => f.preview)]);
  };

  const addImageURL = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const fakeFile = new File([blob], "image_pneumonia.jpg", { type: blob.type });
      addFiles([fakeFile], "URL");
    } catch (error) {
      console.error("Invalid image URL:", error);
    }
  };

  const removeImage = (index) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previewImages];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFiles(updatedFiles);
    setPreviewImages(updatedPreviews);
  };

  const resetUpload = () => {
    setFiles([]);
    setPreviewImages([]);
  };

  return (
    <UploadContext.Provider
      value={{
        files,
        previewImages,
        addFiles,
        addImageURL,
        removeImage,
        resetUpload,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};
