import { useState } from "react"

import "bulma/css/bulma.min.css"
import "./index.css"

import { TopNavbar } from "./components/TopNavbar"
import { FileUploadDownload } from "./components/FileUploadDownload"
import { ExistingAliasScroller } from "./components/ExistingAliasScroller"
import { AliasGenerator } from "./components/AliasGenerator"

function App() {
  const [existingAliasSet, setExistingAliasSet] = useState(new Set<string>())
  const [existingTokenSet, setExistingTokenSet] = useState(new Set<string>())
  const [baseEmail, setBaseEmail] = useState("")

  return (
    <section className="section h-100">
      <div className="container is-max-desktop h-100">
        <TopNavbar />
        <div className="level mb-6">
          <div className="level-item">
            <h2 className="title is-2 has-text-centered">
              Email alias generator
            </h2>
          </div>
        </div>
        <div className="columns">
          <div className="column is-1" />
          <div className="column is-5">
            <FileUploadDownload
              existingAliasSet={existingAliasSet}
              setExistingAliasSet={setExistingAliasSet}
              setExistingTokenSet={setExistingTokenSet}
            />
          </div>
        </div>

        <div className="columns is-8">
          <div className="column is-1" />
          <div className="column is-5 h-100">
            <ExistingAliasScroller
              existingAliasSet={existingAliasSet}
              setExistingAliasSet={setExistingAliasSet}
              setExistingTokenSet={setExistingTokenSet}
              onSelectAlias={(alias: string) => setBaseEmail(alias)}
            />
          </div>
          <div className="column is-5 h-100">
            <AliasGenerator
              existingAliasSet={existingAliasSet}
              setExistingAliasSet={setExistingAliasSet}
              existingTokenSet={existingTokenSet}
              setExistingTokenSet={setExistingTokenSet}
              baseEmail={baseEmail}
              setBaseEmail={setBaseEmail}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default App
