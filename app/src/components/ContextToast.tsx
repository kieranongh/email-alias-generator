import { useEffect } from "react"

interface ContextToastProps {
  message: string
  orientation?: "bottom" | "top"
  duration?: number
  onClose?: () => void
}

export function ContextToast(props: ContextToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.onClose?.()
    }, props.duration ?? 2000)
    return () => clearTimeout(timer)
  }, [props.duration])

  let orientation = {
    top: "calc(100% + 0.5em)",
  }
  if (props.orientation === "top") {
    orientation = {
      top: "-3em",
    }
  }

  return (
    <div className="tag is-medium" style={{
      position: "absolute",
      zIndex: 999,
      whiteSpace: "nowrap",
      ...orientation,
      left: "50%",
      transform: "translateX(-50%)",
    }}>
      {props.message}
    </div>
  )
}