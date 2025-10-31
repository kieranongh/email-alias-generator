import { useEffect, useState } from "react"

export function TopNavbar() {
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  return (
    <nav className="is-flex mb-4 is-justify-content-center">
      <p className="has-text-centered">
        <button className="button is-ghost" onClick={() => setShowHelpModal(true)}>Help</button>
      </p>
      <p className="has-text-centered ml-4">
        <button className="button is-ghost" onClick={() => setShowAboutModal(true)}>About</button>
      </p>
      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
    </nav>
  )
}

interface EscapeHookProps {
  onClose: () => void
}
function useEscape({ onClose }: EscapeHookProps) {
  return useEffect(() => {

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])
}

interface HelpModalProps {
  onClose: () => void
}
export function HelpModal(props: HelpModalProps) {
  useEscape({ onClose: props.onClose })
  
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Help</p>
          <button className="delete" aria-label="close" onClick={props.onClose}></button>
        </header>
        <section className="modal-card-body">
          <ul className="is-list">
            <li>
              Upload (<span className="icon"><i className="fas fa-upload" /></span>)
              existing aliases, if any. This will prevent clashes with existing aliases and allows
              you to delete aliases no longer in use.
            </li>
            <li>
              Enter your base email or click an existing alias and click Generate alias (
                <span className="icon"><i className="fas fa-wand-sparkles" /></span>
              ) to create a new alias. New aliases are automatically added to the list of existing ones.
            </li>
            <li>
              Click Copy (<span className="icon"><i className="fas fa-copy" /></span>) to easily copy
              the alias to the clipboard.
            </li>
            <li>
              Click Delete (<span className="icon"><i className="fas fa-x" /></span>) to delete
              an alias.
            </li>
            <li>
              Download (<span className="icon"><i className="fas fa-download" /></span>) aliases for storage.
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}

interface AboutModalProps {
  onClose: () => void
}
export function AboutModal(props: AboutModalProps) {
  useEscape({ onClose: props.onClose })
  
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">What is an email alias generator?</p>
          <button className="delete" aria-label="close" onClick={props.onClose}></button>
        </header>
        <section className="modal-card-body">
          <p>
            This tool helps you create unique email aliases for sign-ups, testing, or
            filtering incoming messages without needing new accounts. By adding short tags
            to your main address, you can track where messages come from, organize subscriptions,
            and spot unwanted senders. It's a simple way to keep one inbox while striving for some
            control over your contact details.
          </p>
          <br />
          <p>
            This app generates aliases using a well-known convention of&nbsp;
            <a className="link" href="https://en.wikipedia.org/wiki/Email_address#Sub-addressing">
              subaddressing
            </a>
            &nbsp;(also known as plus addressing). We're simply adding 6 digits after the plus (ie.
            <a className="link">me@example.com</a> becomes <a className="link">me+123456@example.com</a>
            ) but may allow for different schemas in future editions. This schema allows for 1 
            million aliases per base email, which is deemed generally sufficient.
          </p>
        </section>
      </div>
    </div>
  )
}