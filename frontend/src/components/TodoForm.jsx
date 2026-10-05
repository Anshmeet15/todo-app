import { useState } from 'react'

function TodoForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setFormError('Title is required.')
      return
    }

    setFormError('')
    const created = await onCreate({
      title: trimmedTitle,
      description: description.trim(),
    })

    if (created) {
      setTitle('')
      setDescription('')
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <input
        className="todo-form__input"
        type="text"
        placeholder="Title (required)"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        className="todo-form__textarea"
        placeholder="Description (optional)"
        rows={2}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      {formError && <p className="form-error">{formError}</p>}
      <button type="submit" className="btn btn--primary">
        Add Todo
      </button>
    </form>
  )
}

export default TodoForm
