const Input = ({ label, type, name, value, onChange, required, placeholder }) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
    />
  </div>
);
export default Input;