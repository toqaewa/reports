import React from 'react';
import { useCSVReader } from 'react-papaparse';
import "./CSVUploader.css";

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
    <div>
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
          <div className='csv-uploader'>
            <div {...getRootProps()} className='drag-area'>
              Выберите или перетащите CSV файл с экспортом задач из Jira
            </div>
            {acceptedFile && (
              <div className='accepted-file'>
                <h3>{acceptedFile.name}</h3>
                <ProgressBar />
                <button {...getRemoveFileProps()} style={{
                  background: 'none',
                  border: 'none',
                  color: 'red',
                  cursor: 'pointer'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 4V5.5C4 5.77614 4.22386 6 4.5 6H19.5C19.7761 6 20 5.77614 20 5.5V4C20 3.72386 19.7761 3.5 19.5 3.5H16.5352C16.2008 3.5 15.8886 3.3329 15.7031 3.0547L15.2969 2.4453C15.1114 2.1671 14.7992 2 14.4648 2H9.53518C9.20083 2 8.8886 2.1671 8.70313 2.4453L8.29687 3.0547C8.1114 3.3329 7.79917 3.5 7.46482 3.5H4.5C4.22386 3.5 4 3.72386 4 4ZM4.99999 9V20C4.99999 21.1046 5.89542 22 6.99999 22H17C18.1046 22 19 21.1046 19 20V9C19 8.44772 18.5523 8 18 8H5.99999C5.4477 8 4.99999 8.44772 4.99999 9Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </CSVReader>
    </div>
  );
};