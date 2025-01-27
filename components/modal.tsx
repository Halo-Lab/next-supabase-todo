'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Properties {
  open: boolean;
  setOpen: (open: boolean) => void;
  submit: (todo: string) => void;
}

export default function Modal({open, setOpen, submit}: Readonly<Properties>) {
  const [todo, setTodo] = useState('');

  const handleApply = () => {
    console.log('Note:', todo);
    setOpen(false);
    setTodo('');
    submit(todo);
  };

  return (
      <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <div className="text-center text-xl font-bold mb-4">New Todo</div>

            <Input
              placeholder="Input your todo..."
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              className="w-full text-center mb-6"
            />

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setOpen(false)} className="w-1/3" >
                Cancel
              </Button>
              <Button onClick={handleApply} className="w-1/3" >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}