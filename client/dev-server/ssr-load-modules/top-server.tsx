import React from 'react'
import ReactDOMServer from 'react-dom/server'
import TopPage from "../../src/views/Top/TopPage";

export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <TopPage />
    </React.StrictMode>
  )
  return { html }
}
