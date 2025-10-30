import { useState } from "react"

import { getNewEmailAlias } from "../services/email-alias-generator"

interface AliasGeneratorProps {
  existingTokenSet: Set<string>
  setExistingTokenSet: React.Dispatch<React.SetStateAction<Set<string>>>
}
export function AliasGenerator(props: AliasGeneratorProps) {

  const [baseEmail, setBaseEmail] = useState("")
  const [error, setError] = useState("")
  const [newAlias, setNewAlias] = useState("")

  const onGenerateAlias = () => {
    let result: string
    try {
      result = getNewEmailAlias({ email: baseEmail, existingTokens: new Set() })
    } catch (err) {
      setError((err as Error).message)
      return
    }
    setNewAlias(result)
    props.setExistingTokenSet(prev => new Set([...prev, result]))
    setError("")
  }

  return (
    <>
      <div className="field">
        <label className="label is-medium ">Email</label>
        <div className="control has-icons-left">
          <input className="input is-medium " type="email"
          placeholder="Base email" value={baseEmail} onChange={(e) => setBaseEmail(e.target.value)} />
          <span className="icon is-left">
            <i className="fas fa-envelope"></i>
          </span>
        </div>
        <p className="help">{error}</p>
      </div>

      <div className="field mt-4 is-flex is-justify-content-center">
        <div className="control">
          <button type="button" className="button is-medium is-primary" onClick={onGenerateAlias}>
            <span>
              Generate alias
            </span>
            <span className="icon is-medium">
              <i className="fas fa-wand-sparkles" />
            </span>
          </button>
        </div>
      </div>

      <div className="field mt-6">
        <label className="label is-medium">New alias</label>
        <div className="box is-size-5 is-flex is-justify-content-space-between is-align-items-center" style={{ minHeight: "80px" }}>
          <p>{newAlias}</p>
          <div>
            <button className="button">
              <span className="icon">
                <i className="fas fa-x"></i>
              </span>
            </button>
            <button className="button ml-2">
              <span className="icon">
                <i className="fas fa-copy"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
