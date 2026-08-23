import { useShow } from "@refinedev/core";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";

import { Department } from "@/types";

const DepartmentShowPage = () => {
  const {
    query: { data, isLoading },
  } = useShow<Department>({ resource: "departments" });

  const department = data?.data;

  return (
    <ShowView>
      <ShowViewHeader />

      <Card>
        <CardHeader>
          <CardTitle>{isLoading ? "Loading..." : department?.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!isLoading && department && (
            <>
              <div className="flex items-center gap-2">
                <Badge>{department.code}</Badge>
                {department.totals && (
                  <Badge variant="secondary">
                    {department.totals.subjects} subjects
                  </Badge>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Description
                </p>
                <p className="text-sm">
                  {department.description ?? "No description provided."}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default DepartmentShowPage;
