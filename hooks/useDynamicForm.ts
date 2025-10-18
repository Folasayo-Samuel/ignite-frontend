"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import createSchema, { Field } from "../schemas/dynamicSchema";

const useDynamicForm = <T extends Record<string, any>>(
  fields: Field[],
  defaultValues?: DefaultValues<T>
) => {
  const schema = createSchema(fields);
  const methods = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues,
  });
  return methods;
};

export default useDynamicForm;
