import React, { ChangeEvent } from "react";

interface TextInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, id, type = "text", value, onChange, className = "" }) => (
  <div className="flex flex-col gap-3">
    <label htmlFor={id} className="font-medium text-lg">
      {label}
    </label>
    <input type={type} name={id} id={id} value={value} onChange={onChange} className={`shadow-sm border border-neutral-300 rounded-md p-3 ${className} text-lg`} />
  </div>
);

export default TextInput;
