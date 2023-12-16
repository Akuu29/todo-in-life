import React from 'react'
import ReactDOMServer from 'react-dom/server'
import SignupPage from "../../src/views/Signup/SignupPage";

export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <SignupPage />
    </React.StrictMode>
  )
  return { html }
}
