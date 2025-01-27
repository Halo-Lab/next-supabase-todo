'use client'

import React, { ChangeEvent, useState } from 'react'

import { TFilter } from '@/types/filter-values-type'
import { TTodo } from '@/types/todo.type'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import { getAllTodos } from '@/app/actions'

interface SearchTodoProps {
  todos: TTodo[];
  onSearch: (filteredTodos: TTodo[]) => void;
}

export default function SearchTodo({ todos, onSearch }: Readonly<SearchTodoProps>) {
  const [filter, setFilter] = useState<TFilter>("All");
  const [search, setSearch] = useState('');

  const handleSearch = async (value: string, currentFilter: TFilter) => {
    if (!value) {
      const todos = await getAllTodos();
      if (currentFilter === "Complete") {
        onSearch(todos.filter(todo => todo.is_completed));
      } else if (currentFilter === "Incomplete") {
        onSearch(todos.filter(todo => !todo.is_completed));
      } else {
        onSearch(todos);
      }
      return;
    }

    const filtered = todos.filter((todo) => {
      const matchesSearch = todo.title.toLowerCase().includes(value.toLowerCase());
      const matchesFilter =
        currentFilter === "All" ||
        (currentFilter === "Complete" && todo.is_completed) ||
        (currentFilter === "Incomplete" && !todo.is_completed);

      return matchesSearch && matchesFilter;
    });

    onSearch(filtered);
  };
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    handleSearch(value, filter);
  };

  const handleFilterChange = (value: TFilter) => {
    setFilter(value);
    handleSearch(search, value);
  };

  return (
    <div className='flex gap-4'>
      <Input type='search' onChange={handleSearchChange} value={search} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {filter}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-content" align="start">
          <DropdownMenuRadioGroup
            value={filter}
            onValueChange={(value) => handleFilterChange(value as TFilter)}
          >
            <DropdownMenuRadioItem className="flex gap-2" value='All'>
              <span>All</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="flex gap-2" value="Complete">
              <span>Complete</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="flex gap-2" value="Incomplete">
              <span>Incomplete</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}