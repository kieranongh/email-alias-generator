import { useRef, useState } from "react"


export function ExistingAliasScroller() {
  const fileUploadRef = useRef<HTMLInputElement>(null)
  const [_, setFileContent] = useState<string>("")

  const onUpload = () => {
    fileUploadRef.current?.click()
  }
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setFileContent(reader.result as string)
    reader.readAsText(file)
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
        <button className="button is-info ml-2">
          <span className="icon">
            <i className="fas fa-download" />
          </span>
          <span>Download</span>
        </button>
        {/* <label className="file-label">
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            <span className="file-label">Upload current aliases</span>
          </span>
        </label> */}
      </div>
      <div className="box mb-4" style={{ minHeight: "100px", overflowY: "scroll" }}>
        <aside className="menu">
          <p className="menu-label">Base email</p>
          <ul className="menu-list">
            {Array.from({ length: 20 }, (_, i) => i + 1).map(x => {
              return (
                <li key={x} className="is-flex">
                  <button>{x}</button>
                  {/* <button className="delete" aria-label="delete"></button> */}
                  <span>
                    <button className="button">
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
