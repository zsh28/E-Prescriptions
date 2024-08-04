export const Error = ({ children }) => {
    return (
        children && (
          <span className="nhsuk-error-message">
            <span className="nhsuk-u-visually-hidden">Error:</span> {children}
          </span>
        )
    )
}
