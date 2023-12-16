import React from 'react'
import ReactDOMServer from 'react-dom/server'
import TodosPage from "../../src/views/Todos/TodosPage";

export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <TodosPage />
    </React.StrictMode>
  )
  return { html }
}
