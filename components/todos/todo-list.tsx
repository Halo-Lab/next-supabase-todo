import Image from 'next/image';
import { useState } from 'react';

import { deleteTodo, updateTodo } from '@/app/actions';
import EmptyTodos from '@/app/empty-todos.svg';
import { TTodo } from '@/types/todo.type';
import TodoItem from './todo-item';

export default function TodoList({ todos, setTodos }: Readonly<{ todos: TTodo[], setTodos: React.Dispatch<React.SetStateAction<TTodo[]>> }>) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const changeStatus = async (todoId: string, isComplete: boolean) => {
    await updateTodo(todoId, { is_completed: isComplete });
    setTodos((prev) => prev.map((todo) => todo.id === todoId ? { ...todo, is_completed: isComplete } : todo));
  }
  const onChangeTitle = async (todoId: string, title: string) => {
    await updateTodo(todoId, { title });
    setTodos((prev) => prev.map((todo) => todo.id === todoId ? { ...todo, title } : todo));
  }
  const onDelete = async (todoId: string) => {
    await deleteTodo(todoId);
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  }

  return (
    <div className='flex justify-center flex-1 h-full w-full'>
      {todos.length
        ? <div className='w-full px-16'>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onChangeStatus={changeStatus}
              onChangeTitle={onChangeTitle}
              onDelete={onDelete}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          ))}
        </div>
        : (
          <div className='flex flex-1 flex-col items-center justify-center'>
            <Image src={EmptyTodos} width={220} height={174} alt='empty' />
            <p>Empty...</p>
          </div>
        )}
    </div>
  )
}
