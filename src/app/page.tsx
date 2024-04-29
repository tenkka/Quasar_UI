'use client'
import { useEffect } from "react";
import axios from "axios";
import { useState } from 'react'

export default function Home() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/data');
        console.log(response)
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name.replace('.csv', ''));

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log('File uploaded successfully!');
      } else {
        console.error('Failed to upload file:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-3xl font-bold mb-8">Database Overview</h1>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Column</th>
              <th className="py-2 px-4">Row</th>
              <th className="py-2 px-4">Filesize</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.column}</td>
                <td className="py-2 px-4">{item.row}</td>
                <td className="py-2 px-4">{item.filesize}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-3xl font-bold mb-8">Upload File</h1>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleSubmit}>Upload</button>
        </div>
          
          
      </div>
    </main>
  );
}
