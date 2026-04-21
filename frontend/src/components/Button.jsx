const Button = ({ children, onClick, type = 'button' }) => (
  <button type={type} onClick={onClick}>
    {children}
  </button>
);
export default Button;