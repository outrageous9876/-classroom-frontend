import { useForm } from "@refinedev/react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateView, CreateViewHeader } from "@/components/refine-ui/views/create-view";

type DepartmentFormValues = {
  code: string;
  name: string;
  description?: string;
};

const DepartmentCreatePage = () => {
  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    refineCoreProps: {
      resource: "departments",
    },
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
            placeholder="e.g. CS"
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
            placeholder="e.g. Computer Science"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">
              {String(errors.name.message)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Short description of the department"
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

export default DepartmentCreatePage;
