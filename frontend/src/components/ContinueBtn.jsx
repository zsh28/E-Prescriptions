const style = {
    "margin": "10px 0"
}

export const ContinueBtn = ({ children, ...props }) => {
  return (
    <button
      className="nhsuk-button nhsuk-button"
      data-module="nhsuk-button"
      type="submit"
      style={style}
      {...props}
    >
      {children ?? "Continue"}
    </button>
  );
};
