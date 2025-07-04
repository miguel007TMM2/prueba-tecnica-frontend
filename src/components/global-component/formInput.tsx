export function FormInput({
  id,
  name,
  type,
  value,
  onChange,
  label,
  autoComplete,
  required = false,
}: {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-4">
      <label
        htmlFor={id}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      />
    </div>
  );
}
