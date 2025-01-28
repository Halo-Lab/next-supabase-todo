import { CircleCheck, CircleX, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { TTodo } from '@/types/todo.type';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';

interface Properties {
  todo: TTodo;
  onChangeStatus: (todoId: string, isComplete: boolean) => void;
  onChangeTitle: (todoId: string, title: string) => Promise<void>;
  onDelete: (todoId: string) => void;
  isEditing: string | null;
  setIsEditing: (todoId: string | null) => void;
}

export default function TodoItem({
  todo,
  onChangeStatus,
  onChangeTitle,
  onDelete,
  setIsEditing,
  isEditing
}: Readonly<Properties>) {
  const [title, setTitle] = useState(todo.title);
  const handleEdit = async () => {
    await onChangeTitle(todo.id, title);
    setIsEditing(null);
    setTitle('');
  }
  const changeStatus = (e: boolean) => {
    onChangeStatus(todo.id, e)
  }
  return (
    <div className='flex items-center justify-between flex-1 gap-4'>
      <div className='flex gap-4 items-center'>
        <Checkbox checked={todo.is_completed} onChange={changeStatus} />
        {isEditing === todo.id
          ? <Input className='min-w-80' value={title} onChange={(e) => setTitle(e?.target.value)} />
          : <p className={todo.is_completed ? 'line-through' : ""}>{todo.title}</p>
        }
      </div>
      <div className='flex gap-2.5'>
        {isEditing === todo.id
          ? <CircleCheck className='cursor-pointer' color='green' onClick={handleEdit} />
          : <Pencil
            className='cursor-pointer'
            size={18}
            onClick={() => {
              setIsEditing(todo.id);
              setTitle(todo.title);
            }}
          />
        }
        {isEditing === todo.id
          ? <CircleX className='cursor-pointer' onClick={() => setIsEditing(null)} color='red' />
          : <Trash2 className='cursor-pointer' size={18} onClick={() => onDelete(todo.id)} />
        }
      </div>
    </div>
  )
}