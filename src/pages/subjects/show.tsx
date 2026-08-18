import { useShow } from "@refinedev/core";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";

import { Subject } from "@/types";

const SubjectShowPage = () => {
  const {
    query: { data, isLoading },
  } = useShow<Subject>({ resource: "subjects" });

  const subject = data?.data;

  return (
    <ShowView>
      <ShowViewHeader />

      <Card>
        <CardHeader>
          <CardTitle>{isLoading ? "Loading..." : subject?.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!isLoading && subject && (
            <>
              <div className="flex items-center gap-2">
                <Badge>{subject.code}</Badge>
                {subject.department?.name && (
                  <Badge variant="secondary">{subject.department.name}</Badge>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Description
                </p>
                <p className="text-sm">
                  {subject.description ?? "No description provided."}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default SubjectShowPage;
