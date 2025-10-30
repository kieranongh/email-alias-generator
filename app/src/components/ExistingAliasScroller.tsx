import { useMemo } from "react"

interface ExistingAliasScrollerProps {
  existingTokenSet: Set<string>
  setExistingTokenSet: React.Dispatch<React.SetStateAction<Set<string>>>
}
export function ExistingAliasScroller(props: ExistingAliasScrollerProps) {
  const existingTokenArray = useMemo(() => {
    return [...props.existingTokenSet]
  }, [props.existingTokenSet])

  const onDeleteAlias = (alias) => () => {
    props.setExistingTokenSet(prev => {
      const next = new Set(prev)
      next.delete(alias)
      return next
    })
  }

  return (
    <nav className="panel mb-4">
      <label className="label is-medium" style={{ padding: "0.2em 1em" }}>Aliases</label>
      <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
      {existingTokenArray.length === 0 && (
        <a className="panel-block has-text-centered">No aliases</a>
      )}
      {existingTokenArray.map(alias => {
        return (
          <a className="panel-block is-flex is-justify-content-space-between" key={alias}>
            <span>{alias}</span>
            <span>
              <button className="button" onClick={onDeleteAlias(alias)}>
                <span className="icon is-small">
                  <i className="fas fa-x"></i>
                </span>
              </button>
            </span>
          </a>
        )
      })}
      </div>
    </nav>
  )
}
