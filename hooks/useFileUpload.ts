"use client";

import { useState } from "react";

export const useFileUpload = (maxFiles: number = 4) => {
  const [files, setFiles] = useState<File[]>([]);
  console.log(files, "filesupload");
  

  const addFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    setFiles,
  };
};
