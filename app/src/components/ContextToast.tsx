import { useEffect } from "react"

interface ContextToastProps {
  message: string
  orientation?: "bottom" | "top"
  duration?: number
  onClose?: () => void
}

export function ContextToast({
  message,
  orientation,
  duration,
  onClose,
}: ContextToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, duration ?? 2000)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  let orientationProps = {
    top: "calc(100% + 0.5em)",
  }
  if (orientation === "top") {
    orientationProps = {
      top: "-3em",
    }
  }

  return (
    <div
      className="tag is-medium"
      style={{
        position: "absolute",
        zIndex: 999,
        whiteSpace: "nowrap",
        ...orientationProps,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {message}
    </div>
  )
}
