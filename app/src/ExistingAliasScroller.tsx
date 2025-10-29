import { useState } from "react"


export function ExistingAliasScroller() {
  const [_, setFileContent] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setFileContent(reader.result as string)
    reader.readAsText(file)
  }

  return (
    <div className="column is-5">
      <div id="file-input" className="file is-boxed is-flex is-justify-content-center">
        <label className="file-label">
          <input className="file-input" type="file" name="resume" onChange={handleFileChange} />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            <span className="file-label">Upload current aliases</span>
          </span>
        </label>
      </div>
      <div className="box" style={{ height: '500px', overflowY: 'scroll' }}>
        <aside className="menu">
          <p className="menu-label">Base email</p>
          <ul className="menu-list">
            {Array.from({ length: 20 }, (_, i) => i + 1).map(x => {
              return (
                <li><a>{x}</a></li>
              )
            })}
          </ul>
        </aside>
      </div>
    </div>
  )
}