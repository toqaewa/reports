import React from 'react';
import { useCSVReader } from 'react-papaparse';

interface CSVUploaderProps {
  onDrop: (results: any) => void;
}

interface CSVReaderChildrenProps {
    getRootProps: () => {
      onClick: (e: React.MouseEvent<HTMLElement>) => void;
      onDragOver: (e: React.DragEvent<HTMLElement>) => void;
      onDragLeave: (e: React.DragEvent<HTMLElement>) => void;
      onDrop: (e: React.DragEvent<HTMLElement>) => void;
    };
    acceptedFile: File | null;
    ProgressBar: React.FC;
    getRemoveFileProps: () => {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    };
  }

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDrop }) => {
  const { CSVReader } = useCSVReader();

  return (
    <div style={{ 
      background: '#f9f9f9', 
      padding: '25px', 
      borderRadius: '8px', 
      marginBottom: '40px',
      border: '2px dashed #ccc'
    }}>
      <CSVReader
        onUploadAccepted={onDrop}
        onError={(error: Error) => console.error(error)}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: CSVReaderChildrenProps) => (
          <div>
            <div {...getRootProps()} style={{
              border: '2px dashed #4CAF50',
              borderRadius: '5px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '10px'
            }}>
              Click to upload or drag and drop CSV file
            </div>
            {acceptedFile && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span>{acceptedFile.name}</span>
                <button {...getRemoveFileProps()} style={{
                  background: 'none',
                  border: 'none',
                  color: 'red',
                  cursor: 'pointer'
                }}>
                  Remove
                </button>
              </div>
            )}
            <ProgressBar />
          </div>
        )}
      </CSVReader>
    </div>
  );
};