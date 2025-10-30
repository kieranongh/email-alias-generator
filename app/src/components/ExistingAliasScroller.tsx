import { useMemo, useState } from "react"

import { ContextToast } from "./ContextToast"
import { getTokenFromAlias } from "../services/email-alias-generator"

interface ExistingAliasScrollerProps {
  existingAliasSet: Set<string>
  setExistingAliasSet: React.Dispatch<React.SetStateAction<Set<string>>>
  setExistingTokenSet: React.Dispatch<React.SetStateAction<Set<string>>>
  onSelectAlias: (alias: string) => void
}
export function ExistingAliasScroller(props: ExistingAliasScrollerProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [selectedAlias, setSelectedAlias] = useState<string | null>(null)

  const existingAliasArray = useMemo(() => {
    return [...props.existingAliasSet]
  }, [props.existingAliasSet])

  const onCopyToClipboard = (alias: string) => async (e) => {
    e.stopPropagation()
    try {
      await window.navigator.clipboard.writeText(alias)
      setSelectedAlias(alias)
      setToastMessage("Copied!")
    } catch (err) {
      console.error("Unable to copy to clipboard.", err)
      setSelectedAlias(null)
      setToastMessage("Copy failed.")
    }
  }

  const onDeleteAlias = (alias: string) => (e) => {
    e.stopPropagation()
    props.setExistingAliasSet(prev => {
      const next = new Set(prev)
      next.delete(alias)
      return next
    })
    props.setExistingTokenSet(prev => {
      const next = new Set(prev)
      const token = getTokenFromAlias(alias)
      next.delete(token)
      return next
    })
  }

  const onDeleteAllAliases = () => {
    props.setExistingAliasSet(new Set())
    props.setExistingTokenSet(new Set())
  }

  return (
    <nav className="box panel mb-4">
      <div className="is-flex is-justify-content-space-between is-align-items-center">
        <label className="label is-medium ml-4" style={{ padding: "0.2em 0" }}>
          <span>
            Aliases
          </span>
        </label>
        <button className="button is-outline is-small mr-2" onClick={onDeleteAllAliases}>
          <span>Clear all</span>
        </button>
        </div>
      <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
      {existingAliasArray.length === 0 && (
        <a className="panel-block has-text-centered">No aliases</a>
      )}
      {existingAliasArray.map((alias, i) => {
        return (
          <a className="panel-block is-flex is-justify-content-space-between" key={alias} onClick={() => props.onSelectAlias(alias)}>
            <span>{alias}</span>
            <div className="is-flex">
              <div className="is-relative">
                <button className="button" onClick={onCopyToClipboard(alias)}>
                  <span className="icon">
                    <i className="fas fa-copy"></i>
                  </span>
                </button>
                {toastMessage && alias === selectedAlias && (
                  <ContextToast
                    message={toastMessage}
                    onClose={() => {
                      setToastMessage(null)
                      setSelectedAlias(null)
                    }}
                  />
                )}
              </div>
              <button className="button ml-2" onClick={onDeleteAlias(alias)}>
                <span className="icon is-small">
                  <i className="fas fa-x"></i>
                </span>
              </button>
            </div>
          </a>
        )
      })}
      </div>
    </nav>
  )
}
