type ConfigSelectProps<T> = {
  value: keyof T;
  id: string;
  setValue: (value: keyof T) => void;
  values: { label: string; value: keyof T }[];
  label: string;
};

const ConfigSelect = <T,>({
  id,
  value,
  setValue,
  values,
  label,
}: ConfigSelectProps<T>) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        fontSize: '.8rem',
        alignItems: 'start',
        gap: '.2rem',
      }}
    >
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value.toString()}
        onChange={(e) => setValue(e.target.value as keyof T)}
        style={{ fontSize: '.8rem', padding: '.2rem' }}
      >
        {values.map((current, index) => (
          <option key={`${id}-${index}`} value={current.value.toString()}>
            {current.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ConfigSelect;
