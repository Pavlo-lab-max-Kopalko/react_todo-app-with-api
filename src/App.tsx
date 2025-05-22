/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, patchTodos, USER_ID } from './api/todos';
import { ErrorMessage, FilteredStatus, Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import cn from 'classnames';
import { FormAddTodo } from './components/FormAddTodo';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [rrorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.DEFAULT,
  );
  const [count, setCount] = useState<number>(0);
  const [filterValue, setFilterValue] = useState<FilteredStatus>(
    FilteredStatus.ALL,
  );
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | undefined>();

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.DEFAULT);
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onHandler = () => {
    setErrorMessage(ErrorMessage.DEFAULT);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage(ErrorMessage.DEFAULT);
  };

  const onInputChange = (
    todoId: number,
    change: string,
    value?: HTMLInputElement['value'],
  ) => {
    const seekTodo = todos.find(todo => todo.id === todoId);

    if (change === 'status') {
      const backStatus = seekTodo?.completed;
      const changArg = { completed: !backStatus };

      patchTodos(todoId, changArg)
        .then(response => {
          const mappedTodos: Todo[] = todos.map(todo => {
            if (todo.id === todoId) {
              return response as Todo;
            }

            return todo;
          });

          setTodos(mappedTodos);
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.UPDATE);
        })
        .finally(() =>
          setDeletedTodoId(prevIds => prevIds.filter(id => id !== todoId)),
        );
    }

    if (change === 'title') {
      const changArg = { title: value };

      patchTodos(todoId, changArg)
        .then(response => {
          const mappedTodos: Todo[] = todos.map(todo => {
            if (todo.id === todoId) {
              return response as Todo;
            }

            return todo;
          });

          setTodos(mappedTodos);
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.UPDATE);

          setTimeout(() => {
            setErrorMessage(ErrorMessage.DEFAULT);
          }, 3000);
        });
    }
  };

  console.log(todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <FormAddTodo
            onSubmit={handleSubmit}
            setTodos={setTodos}
            todos={todos}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
            tempTodo={tempTodo}
            inputRef={inputRef}
          />
        </header>

        <TodoList
          todos={todos}
          setTodos={setTodos}
          setCount={setCount}
          filterValue={filterValue}
          onInputChange={onInputChange}
          tempTodo={tempTodo}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          deletedTodoId={deletedTodoId}
          setDeletedTodoId={setDeletedTodoId}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />

        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <Footer
            count={count}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            todos={todos}
            setTodos={setTodos}
            inputRef={inputRef}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !rrorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onHandler}
        />
        {/* show only one message at a time */}
        {rrorMessage}
      </div>
    </div>
  );
};
