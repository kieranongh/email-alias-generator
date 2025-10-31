// Allow window to be extended with custom functions
interface Window {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [key: string]: Function
}
