import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

interface Option {
  label: string;
  value: string;
}

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: string;
  description?: string;
  autocomplete?: string;
  disabled?: boolean;
  options?: Option[];
}

const FormFields = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  description,
  autocomplete = "on",
  disabled = false,
  options = [],
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel>{label}</FieldLabel>
          <FieldContent>
            {type === "textarea" ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                aria-invalid={!!fieldState.error}
                onChange={(e) => field.onChange(e.target.value)}
                rows={5}
                disabled={disabled}
                value={field.value ?? ""}
              />
            ) : type === "select" ? (
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue>
                    {field.value
                      ? options.find((opt) => opt.value === field.value)?.label
                      : placeholder || "Select..."}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                {...field}
                className="dark:border-gray-600"
                placeholder={placeholder}
                type={type}
                aria-invalid={!!fieldState.error}
                value={field.value ?? ""}
                onChange={(e) => {
                  if (type === "number") {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(undefined);
                    } else {
                      const numericValue = parseFloat(value);
                      if (!isNaN(numericValue)) {
                        field.onChange(numericValue);
                      }
                    }
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                autoComplete={autocomplete}
                disabled={disabled}
              />
            )}
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </FieldContent>
        </Field>
      )}
    />
  );
};

export default FormFields;