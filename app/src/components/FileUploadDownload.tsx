import { useRef } from "react"
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

interface FileUploadDownloadProps {
  existingTokenSet: Set<string>
  setExistingTokenSet: React.Dispatch<React.SetStateAction<Set<string>>>
}
export function FileUploadDownload(props: FileUploadDownloadProps) {
  const fileUploadRef = useRef<HTMLInputElement>(null)

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

  return (
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
  )
}
