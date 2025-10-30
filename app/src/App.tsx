import { useState } from "react"

import "bulma/css/bulma.min.css"
import "./index.css"

import { ExistingAliasScroller } from "./components/ExistingAliasScroller"
import { AliasGenerator } from "./components/AliasGenerator"
import { TopNavbar } from "./components/TopNavbar"

function App() {
  const [existingTokenSet, setExistingTokenSet] = useState(new Set<string>())
  return (
    <section className="section h-100">
      <div className="container is-max-desktop h-100">
        <TopNavbar />
        <div className="level mb-6">
          <div className="level-item">
            <h2 className="title is-2 has-text-centered">Email alias generator</h2>
          </div>
        </div>

        <div className="columns">
          <div className="column is-1" />
          <div className="column is-4 h-100">
            <ExistingAliasScroller
              existingTokenSet={existingTokenSet}
              setExistingTokenSet={setExistingTokenSet}
            />
          </div>
          <div className="column is-1" />
          <div className="column is-5 h-100">
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
