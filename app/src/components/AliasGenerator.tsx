import { useState } from "react"

export function AliasGenerator() {

  const [baseEmail, setBaseEmail] = useState("")

  const onGenerateAlias = () => {
  }

  return (
    <>
      <div className="field" style={{ marginTop: "100px" }}>
        <label className="label is-medium ">Email</label>
        <div className="control has-icons-left">
          <input className="input is-medium " type="email"
          placeholder="Base email" value={baseEmail} onChange={(e) => setBaseEmail(e.target.value)} />
          <span className="icon is-left">
            <i className="fas fa-envelope"></i>
          </span>
        </div>
        {/* <p className="help">This email is invalid</p> */}
      </div>

      <div className="field mt-4 is-flex is-justify-content-center">
        <div className="control">
          <button className="button is-medium is-primary" onClick={onGenerateAlias}>
            Generate alias
          </button>
        </div>
      </div>

      <div className="field mt-6">
        <label className="label is-medium">New alias</label>
        <div className="box is-size-5 is-flex is-justify-content-space-between is-align-items-center" style={{ minHeight: "80px" }}>
          <p>{baseEmail || "Generated alias"}</p>
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
