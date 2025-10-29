import 'bulma/css/bulma.min.css'

import { ExistingAliasScroller } from './ExistingAliasScroller'

function App() {
  return (
    <>
      <div className="container is-fluid my-5">
        <h1 className="title">Email alias generator</h1>

        <div className="columns">
          <ExistingAliasScroller />
        </div>
      </div>

    </>
  )
}

export default App
