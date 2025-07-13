import { useEffect, useState } from "react";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    getTodos().then(setTodos);
  }, []);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const todo = await createTodo({ title: newTitle, completed: false });
    setTodos([todo, ...todos]);
    setNewTitle("");
  };

  const handleToggle = async (todo) => {
    const updated = await updateTodo(todo.id, {
      ...todo,
      completed: !todo.completed,
    });
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4">
        <input
          className="border p-2 flex-1"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new todo"
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between border-b py-2"
          >
            <span
              className={`flex-1 cursor-pointer ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
              onClick={() => handleToggle(todo)}
            >
              {todo.title}
            </span>
            <button
              className="ml-4 text-red-500"
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList; 