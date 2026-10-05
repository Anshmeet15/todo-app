import TodoItem from './TodoItem'

function TodoList({
  todos,
  onToggle,
  onUpdate,
  onDelete,
  emptyMessage = 'No todos yet. Add your first one above!',
}) {
  if (todos.length === 0) {
    return <p className="empty">{emptyMessage}</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList
