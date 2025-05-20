/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
// import { deleteTodos } from '../../api/todos';

interface Props {
  todo: Todo;
  onInputChange: (
    todoId: number,
    change: string,
    value?: HTMLInputElement['value'],
  ) => void;
  onDelete: (todoId: number) => void;
  deletedTodoId: number[];
  setDeletedTodoId: React.Dispatch<React.SetStateAction<number[]>>;
  editingTodoId: number | undefined;
  setEditingTodoId: (value: number | undefined) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const TodoItem = ({
  todo,
  onInputChange,
  onDelete,
  deletedTodoId,
  setDeletedTodoId,
  editingTodoId,
  setEditingTodoId,
  inputRef,
}: Props) => {
  const [titleTodo, setTitleTodo] = useState<string>(todo.title);
  const handleBlur = (
    value: HTMLInputElement['value'],
    e: React.FocusEvent<HTMLInputElement, Element>,
  ) => {
    if (value === '') {
      // deleteTodos(todo.id)
      //   .then(() => {
      //     inputRef.current?.focus();
      //     const exsistedTodos = todos.filter(todo => todo.id !== todoId);

      //     setTodos(exsistedTodos);
      //   })
      //   .catch(() => {
      //     setErrorMessage(ErrorMessage.DELETE);

      //     setTimeout(() => {
      //       setErrorMessage(ErrorMessage.DEFAULT);
      //     }, 3000);
      //   })
      //   .finally(() =>
      //     setDeletedTodoId(prevIds => prevIds.filter(id => id !== todoId)),
      //   );
    }

    e.preventDefault();
    setEditingTodoId(undefined);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo item-enter-done', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            setDeletedTodoId(prevIds => [...prevIds, todo.id]);
            onInputChange(todo.id, 'status');
          }}
        />
      </label>

      {editingTodoId !== todo.id ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditingTodoId(todo.id)}
        >
          {todo.title}
        </span>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            setEditingTodoId(undefined);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleTodo}
            onChange={e => {
              onInputChange(todo.id, 'title', e.target.value);
              setTitleTodo(e.target.value);
            }}
            onBlur={e => handleBlur(e.target.value, e)}
          />
        </form>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': deletedTodoId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
