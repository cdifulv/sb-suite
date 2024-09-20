'use client';

import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import { type ExpenseImport, type ExpenseImportData } from '@/types/expense';
import trimWhitespace from '@/lib/trimWhitespace';
import { toast } from '@/components/ui/use-toast';

export function ExpensesImport({
  setImportData
}: {
  setImportData: (data: ExpenseImport[]) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          Papa.parse<ExpenseImportData>(file, {
            header: true,
            error(error) {
              toast({
                title: 'An error occurred',
                description: 'An error occurred while parsing the file.'
              });
              console.log(error);
            },
            complete: (result) => {
              const data = result.data.map((row: ExpenseImportData) => {
                const cleanedRow: ExpenseImport = {
                  id: uuidv4(),
                  date: trimWhitespace(row.Date),
                  amount: Math.round(
                    parseFloat(trimWhitespace(row.Amount)) * 100
                  ),
                  description: trimWhitespace(row.Description)
                };
                return cleanedRow;
              });
              setImportData(data);
            }
          });
        };
        reader.readAsText(file);
      });
    },
    [setImportData]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] }
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded p-5 text-center cursor-pointer "
    >
      <input {...getInputProps()} />
      <Upload className="h-8 w-8 mx-auto mb-2" />
      {isDragActive ? (
        <p className="my-3.5">Drop the files here ...</p>
      ) : (
        <>
          <p>Drag &apos;n&apos; drop files here, or click to select files</p>
          <p className="text-sm text-gray-500">Only CSV files are supported</p>
        </>
      )}
    </div>
  );
}
