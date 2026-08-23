import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";

import { Textarea } from "@/components/ui/textarea";
import { useBack } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import UploadWidget from "@/components/upload-widget";
import { UploadWidgetValue } from "@/types";
import { z } from "zod";

// Only fields that make sense to edit after creation — matches the
// backend's PUT /classes/:id, which intentionally excludes subjectId,
// teacherId, and inviteCode.
const classEditSchema = z.object({
  name: z
    .string()
    .min(2, "Class name must be at least 2 characters")
    .max(50, "Class name must be at most 50 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .min(5, "Description must be at least 5 characters"),
  capacity: z.coerce
    .number({
      required_error: "Capacity is required",
      invalid_type_error: "Capacity is required",
    })
    .int("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1"),
  status: z.enum(["active", "inactive"]),
  bannerUrl: z
    .string({ required_error: "Class banner is required" })
    .min(1, "Class banner is required"),
  bannerCldPubId: z
    .string({ required_error: "Banner reference is required" })
    .min(1, "Banner reference is required"),
});

const ClassesEdit = () => {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(classEditSchema),
    refineCoreProps: {
      resource: "classes",
      action: "edit",
    },
  });

  const {
    refineCore: { onFinish, query },
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = form;

  const bannerPublicId = form.watch("bannerCldPubId");

  const onSubmit = async (values: z.infer<typeof classEditSchema>) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  if (query?.isLoading) {
    return (
      <CreateView className="class-view">
        <Breadcrumb />
        <p className="state-message">Loading class...</p>
      </CreateView>
    );
  }

  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Edit Class</h1>
      <div className="intro-row">
        <p>Update the details for this class.</p>
        <Button onClick={() => back()}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Update details
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Banner Image <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <UploadWidget
                          value={
                            field.value
                              ? {
                                  url: field.value,
                                  publicId: bannerPublicId ?? "",
                                }
                              : null
                          }
                          onChange={(file: UploadWidgetValue | null) => {
                            if (file) {
                              field.onChange(file.url);
                              form.setValue("bannerCldPubId", file.publicId, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            } else {
                              field.onChange("");
                              form.setValue("bannerCldPubId", "", {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      {errors.bannerCldPubId && !errors.bannerUrl && (
                        <p className="text-destructive text-sm">
                          {errors.bannerCldPubId.message?.toString()}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introduction to Biology - Section A"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Capacity <span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="30"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? Number(value) : undefined);
                            }}
                            value={(field.value as number | undefined) ?? ""}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Status <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description about the class"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex gap-1">
                      <span>Saving Changes...</span>
                      <Loader2 className="inline-block ml-2 animate-spin" />
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default ClassesEdit;