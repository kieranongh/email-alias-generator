import { useState } from "react"

import { getNewEmailAlias } from "../services/email-alias-generator"
import { ContextToast } from "./ContextToast"

interface AliasGeneratorProps {
  existingAliasSet: Set<string>
  setExistingAliasSet: React.Dispatch<React.SetStateAction<Set<string>>>
  existingTokenSet: Set<string>
  setExistingTokenSet: React.Dispatch<React.SetStateAction<Set<string>>>
  baseEmail: string
  setBaseEmail: React.Dispatch<React.SetStateAction<string>>
}
export function AliasGenerator(props: AliasGeneratorProps) {
  const [error, setError] = useState("")
  const [newAlias, setNewAlias] = useState("")
  const [newToken, setNewToken] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const onClearBaseEmail = () => {
    props.setBaseEmail("")
  }

  const onBaseEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      onGenerateAlias()
    }
  }

  const onGenerateAlias = () => {
    let alias: string, token: string
    try {
      ({ alias, token } = getNewEmailAlias({ email: props.baseEmail, existingTokens: props.existingTokenSet }))
    } catch (err) {
      setError((err as Error).message)
      return
    }
    setNewAlias(alias)
    setNewToken(token)
    props.setExistingAliasSet(prev => new Set([...prev, alias]))
    props.setExistingTokenSet(prev => new Set([...prev, token]))
    setError("")
  }

  const onDeleteNewAlias = () => {
    if (newAlias) {
      props.setExistingAliasSet(prev => {
        const next = new Set(prev)
        next.delete(newToken)
        return next
      })
      props.setExistingTokenSet(prev => {
        const next = new Set(prev)
        next.delete(newAlias)
        return next
      })
      setNewAlias("")
      setNewToken("")
    }
  }
  const onCopyToClipboard = async () => {
    if (newAlias) {
      try {
        await window.navigator.clipboard.writeText(newAlias)
        setToastMessage("Copied!")
      } catch (err) {
        console.error("Unable to copy to clipboard.", err)
        setToastMessage("Copy failed.")
      }
    }
  }

  return (
    <div className="box">
      <div className="field">
        <label className="label is-medium">Email</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className="input is-medium"
            type="email"
            placeholder="Base email"
            value={props.baseEmail}
            onChange={(e) => props.setBaseEmail(e.target.value)}
            onKeyDown={onBaseEmailKeyDown}
            autoFocus
          />
          <span className="icon is-left">
            <i className="fas fa-envelope"></i>
          </span>
          <span className="icon is-right is-clickable" onClick={onClearBaseEmail}>
            <i className="fas fa-x"></i>
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
          <div className="is-flex">
            <div className="is-relative">
              <button className="button" onClick={onCopyToClipboard}>
                <span className="icon">
                  <i className="fas fa-copy"></i>
                </span>
              </button>
              {toastMessage && (
                <ContextToast
                  message={toastMessage}
                  onClose={() => setToastMessage(null)}
                />
              )}
            </div>
            <button className="button ml-2" onClick={onDeleteNewAlias}>
              <span className="icon">
                <i className="fas fa-x"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
