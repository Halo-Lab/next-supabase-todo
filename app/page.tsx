import { InfoIcon } from "lucide-react";

import TodosWrapper from "@/components/todos/todos-wrapper";
import { getAllTodos, getCurrentUser } from "./actions";

export default async function ProtectedPage() {
  const [todos] = await Promise.all([ getAllTodos(), getCurrentUser()]);

  return (
    <div className="flex-1 w-full h-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>
      <TodosWrapper todos={todos} />
    </div>
  );
}
