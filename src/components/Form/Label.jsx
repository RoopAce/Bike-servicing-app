const Label = ({ className, htmlFor, children }) => {
  return (
    <label className={`${className ? className : ""}`} htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default Label;
