'use client'
import { useEffect } from "react";
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

export default function Home() {
  const [data, setData] = useState<any[]>([
    { name: 'cat1', column: ['RA', 'DEC', 'Name'], row: 1000, filesize: '100000 bytes' },
    { name: 'cat2', column: ['RA', 'DEC', 'Name'], row: 1000, filesize: '100000 bytes' },
    { name: 'cat3', column: ['RA', 'DEC', 'Name'], row: 1000, filesize: '100000 bytes' },
    { name: 'cat4', column: ['RA', 'DEC', 'Name'], row: 1000, filesize: '100000 bytes' },
    { name: 'cat5', column: ['RA', 'DEC', 'Name'], row: 1000, filesize: '100000 bytes' },
  ]);
  const [order, setOrder] = useState<any[]>([
    
  ]);
  const [file, setFile] = useState<any>(null);
  
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name.replace('.csv', ''));
    try {
      let response = await axios.post('http://localhost:4000/upload', formData);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    fetchData();
  };

  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    let r = await axios.get('http://localhost:4000/data');
    setData(r.data);
    let o = []
    for (let i = 0; i < r.data.length; i++) {
      o.push(r.data[i].name);
    }
    setOrder(o);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDragEnd = (result: any) => {
    // Reorder the list
    if (!result.destination) return;
    const items = Array.from(order);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOrder(items);
    console.log(items);
  };

  const merge = async () => {
    // Merge the database
    setLoading(true);
    let formData = new FormData();
    formData.append('order', JSON.stringify(order));
    formData.append('outname', 'output.csv');
    let r = await axios.post('http://localhost:4000/merge', formData, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([r.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'output.csv');
    document.body.appendChild(link);
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm ">
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
            {data.map((item: any, index) => (
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
          <button onClick={handleSubmit} className="border border-solid border-gray-500 px-4 py-2 rounded-lg">Upload</button>
        </div>

        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm mt-5">
          <div className="flex flex-row">
            <h1 className="text-3xl font-bold mb-8 mr-8">Order & Merge</h1>
            {!loading && <button onClick={merge} className="border border-solid border-gray-500 px-4 py-2 rounded-lg h-full">MERGE</button>}
            {loading && <button className="border border-solid border-gray-500 px-4 py-2 rounded-lg h-full">Loading...</button>}
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {order.map((item, index) => (
                    <Draggable key={item} draggableId={item} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border border-solid border-gray-500 px-4 py-2 rounded-lg mb-2"
                        >
                          {item}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </main>
  );
}