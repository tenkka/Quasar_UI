'use client'
import { useEffect } from "react";
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Home() {
  const [data, setData] = useState<any[]>([
    { name: 'cat1', column: ['RA', 'DEC', 'Name'], row: 1000, filesize: '100000 bytes' },
    { name: 'cat2', column: ['RA', 'DEC', 'Name'], row: 1000, filesize: '100000 bytes' },
    { name: 'cat3', column: ['RA', 'DEC', 'Name'], row: 1000, filesize: '100000 bytes' },
    { name: 'cat4', column: ['RA', 'DEC', 'Name'], row: 1000, filesize: '100000 bytes' },
    { name: 'cat5', column: ['RA', 'DEC', 'Name'], row: 1000, filesize: '100000 bytes' },
  ]);
  const [order, setOrder] = useState<any[]>([
    'cat1', 'cat2', 'cat3', 'cat4', 'cat5'
  ]);
  const [file, setFile] = useState<any>(null);
  
  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    // Handle file upload
  };

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
            <button onClick={merge} className="border border-solid border-gray-500 px-4 py-2 rounded-lg h-full">MERGE</button>
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