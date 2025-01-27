'use client'

import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'

import { addTodo } from '@/app/actions'
import { TTodo } from '@/types/todo.type'
import Modal from './modal'
import SearchTodo from '../search-todo'
import TodoList from './todo-list'
import { Button } from '../ui/button'

interface Properties {
  todos: TTodo[];
}

export default function TodosWrapper({ todos }: Readonly<Properties>) {
  const [filteredTodos, setFilteredTodos] = useState<TTodo[]>(todos);
  const [open, setOpen] = useState(false)

  const submit = async (todo: string) => {
    const newTodo = await addTodo(todo);
    setFilteredTodos((prev) => ([newTodo, ...prev]));
  }

  return (
    <>
      <div className="flex flex-col gap-4 flex-1">
        <div className="text-center text-xl">TODO LIST</div>
        <SearchTodo todos={filteredTodos} onSearch={setFilteredTodos} />
        <TodoList todos={filteredTodos} setTodos={setFilteredTodos} />
        <Button variant='ghost' size='icon' className='fixed bottom-16 right-6 w-12 h-12' onClick={() => setOpen(true)}>
          <CirclePlus size={36} />
        </Button>
      </div>
      <Modal open={open} setOpen={setOpen} submit={submit} />
    </>
  )
}

