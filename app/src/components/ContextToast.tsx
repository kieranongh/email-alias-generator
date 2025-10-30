import { useEffect } from "react"

interface ContextToastProps {
  message: string
  duration?: number
  onClose?: () => void
}

export function ContextToast({ message, duration = 2000, onClose }: ContextToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration])

  return (
    <div className="tag is-medium" style={{
      position: "absolute",
      zIndex: 999,
      whiteSpace: "nowrap",
      top: "calc(100% + 0.5em)",
      left: "50%",
      transform: "translateX(-50%)",
    }}>
      {message}
    </div>
  )
}