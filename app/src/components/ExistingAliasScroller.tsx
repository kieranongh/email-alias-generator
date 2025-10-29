import { useMemo, useRef } from "react"
import { readAliasesFile, writeAliasesFile } from "../services/email-alias-generator"

const downloadFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

interface ExistingAliasScrollerProps {
  existingTokenSet: Set<string>
  setExistingTokenSet: React.Dispatch<React.SetStateAction<Set<string>>>
}
export function ExistingAliasScroller(props: ExistingAliasScrollerProps) {
  const fileUploadRef = useRef<HTMLInputElement>(null)

  const existingTokenArray = useMemo(() => {
    return [...props.existingTokenSet]
  }, [props.existingTokenSet])

  const onUpload = () => {
    fileUploadRef.current?.click()
  }
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const uploadedSet = readAliasesFile(text)
    props.setExistingTokenSet(uploadedSet)
  }

  const onDownload = () => {
    const fileText = writeAliasesFile(props.existingTokenSet)
    downloadFile("Email aliases.csv", fileText)
  }

  const onDeleteAlias = (alias) => () => {
    props.setExistingTokenSet(prev => {
      const next = new Set(prev)
      next.delete(alias)
      return next
    })
  }

  return (
    <div className="is-flex is-flex-direction-column h-100">
      <div id="file-input" className="file is-boxed is-flex is-justify-content-center">
        <button className="button is-info" onClick={onUpload}>
          <span className="icon">
            <i className="fas fa-upload" />
          </span>
          <span>Upload</span>
        </button>
        <input ref={fileUploadRef} type="file" hidden onChange={onFileChange} />
        <button className="button is-info ml-2" onClick={onDownload}>
          <span className="icon">
            <i className="fas fa-download" />
          </span>
          <span>Download</span>
        </button>
      </div>
      <div className="box mb-4" style={{ minHeight: "100px", overflowY: "scroll" }}>
        <aside className="menu">
          <p className="menu-label">Base email</p>
          <ul className="menu-list">
            {existingTokenArray.map(alias => {
              return (
                <li key={alias} className="is-flex">
                  <button>{alias}</button>
                  <span>
                    <button className="button" onClick={onDeleteAlias(alias)}>
                      <span className="icon is-small">
                        <i className="fas fa-x"></i>
                      </span>
                    </button>
                  </span>
                </li>
              )
            })}
          </ul>
        </aside>
      </div>
    </div>
  )
}
