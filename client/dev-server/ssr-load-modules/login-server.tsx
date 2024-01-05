import React from 'react'
import ReactDOMServer from 'react-dom/server'
import LoginPage from "../../src/views/Login/LoginPage";

export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <LoginPage />
    </React.StrictMode>
  )
  return { html }
}
