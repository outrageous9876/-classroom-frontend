import { useForm } from "@refinedev/react-hook-form";
import { useSelect } from "@refinedev/core";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";

type SubjectFormValues = {
  code: string;
  name: string;
  departmentId: number | null;
  description?: string;
};

const SubjectCreatePage = () => {
  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormValues>({
    refineCoreProps: {
      resource: "subjects",
    },
    defaultValues: {
      departmentId: null,
    },
  });

  const { options: departmentOptions } = useSelect({
    resource: "departments",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <CreateView>
      <CreateViewHeader />

      <form
        className="flex max-w-xl flex-col gap-6"
        onSubmit={handleSubmit(onFinish)}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            placeholder="e.g. CS101"
            {...register("code", { required: "Code is required" })}
          />
          {errors.code && (
            <p className="text-sm text-destructive">
              {String(errors.code.message)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. Introduction to Computer Science"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">
              {String(errors.name.message)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="departmentId">Department</Label>
          <Controller
            name="departmentId"
            control={control}
            rules={{ required: "Department is required" }}
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) =>
                  field.onChange(value ? Number(value) : null)
                }
              >
                <SelectTrigger id="departmentId">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.departmentId && (
            <p className="text-sm text-destructive">
              {String(errors.departmentId.message)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Short description of the subject"
            {...register("description")}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-fit">
          Save
        </Button>
      </form>
    </CreateView>
  );
};

export default SubjectCreatePage;