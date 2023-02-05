import { Field, ErrorMessage } from "formik"
import clsx from "clsx"

export const TextField = ({
  fieldName,
  fieldLabel,
  className,
  placeholder,
}: {
  fieldName: string
  fieldLabel?: string
  placeholder?: string
  className?: string
}) => {
  return (
    <div>
      {fieldLabel && <h2>{fieldLabel}</h2>}
      <Field
        type="text"
        name={fieldName}
        className={clsx("rounded-2xl p-2", className)}
        placeholder={placeholder || ""}
      />
      <ErrorMessage name={fieldName} component="div" />
    </div>
  )
}