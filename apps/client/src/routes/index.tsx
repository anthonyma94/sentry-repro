import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'
import '../App.css'
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const {trpc} = Route.useRouteContext();
  const [error, setError] = useState("");
  const onErrorClick = async () => {
    try {
      await trpc.error.mutate();
      setError("");
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        <button className="App-link" onClick={onErrorClick}>
          Trigger Error
        </button>
        <p>
          Edit <code>src/routes/index.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="App-link"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
      </header>
    </div>
  )
}
