import { useState } from "react"

import "bulma/css/bulma.min.css"
import "./index.css"

import { ExistingAliasScroller } from "./components/ExistingAliasScroller"
import { AliasGenerator } from "./components/AliasGenerator"

function App() {
  const [existingTokenSet, setExistingTokenSet] = useState(new Set<string>())
  return (
    <section className="section h-100">
      <div className="container is-max-desktop h-100">
        <h1 className="title">Email alias generator</h1>

        <div className="columns h-100">
          <div className="column is-1" />
          <div className="column is-4 h-100">
            <ExistingAliasScroller
              existingTokenSet={existingTokenSet}
              setExistingTokenSet={setExistingTokenSet}
            />
          </div>
          <div className="column is-1" />
          <div className="column is-5 h-100" style={{ height: "100%"}}>
            <AliasGenerator
              existingTokenSet={existingTokenSet}
              setExistingTokenSet={setExistingTokenSet}
            />
          </div>
        </div>
      </div>

    </section>
  )
}

export default App
