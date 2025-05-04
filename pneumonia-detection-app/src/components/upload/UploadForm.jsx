import React, { useState } from 'react';

export default function UploadForm() {
  const [fileList, setFileList] = useState([]);
  const [imageURL, setImageURL] = useState('');

  const handleUpload = (e) => {
    setFileList([...e.target.files]);
  };

  const handleURLSubmit = () => {
    if (imageURL) {
      setFileList([{ name: imageURL, url: imageURL }]);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" multiple onChange={handleUpload} className="block" />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Paste image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={handleURLSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add URL
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {fileList.map((file, index) => (
          <div key={index} className="border p-2 rounded shadow">
            <img
              src={file.url || URL.createObjectURL(file)}
              alt={`preview-${index}`}
              className="w-full h-40 object-contain"
            />
            <p className="mt-2 text-sm text-center">{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
