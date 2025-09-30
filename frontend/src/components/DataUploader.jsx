import React, { useCallback, useState } from 'react';
import { FiUpload, FiFile, FiX, FiCheck, FiDatabase } from 'react-icons/fi';

const DataUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files) => {
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'uploading'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload completion
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(f => 
          newFiles.find(nf => nf.id === f.id) 
            ? { ...f, status: 'completed' } 
            : f
        )
      );
    }, 2000);
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Data</h3>
      <p className="text-gray-600 mb-6">Import CSV files or connect to your SaaS platforms</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <div>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag & drop your CSV files here</p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
            >
              Browse Files
            </label>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FiFile className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'completed' ? (
                      <FiCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SaaS Integrations */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Connect SaaS Platforms</h4>
          <div className="space-y-3">
            {['Shopify', 'Stripe', 'Google Analytics', 'QuickBooks', 'Mailchimp'].map((service) => (
              <button
                key={service}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <FiDatabase className="w-5 h-5 text-teal-500" />
                  <span className="font-medium text-gray-800">{service}</span>
                </div>
                <div className="text-sm text-gray-500">Connect</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUploader;