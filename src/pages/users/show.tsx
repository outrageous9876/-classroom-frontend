import { useShow } from "@refinedev/core";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view";

import { User } from "@/types";

const UserShowPage = () => {
  const {
    query: { data, isLoading, isError },
  } = useShow<User>({ resource: "users" });

  const user = data?.data;

  if (isLoading || isError || !user) {
    return (
      <ShowView>
        <ShowViewHeader canEdit={false} />
        <p className="state-message">
          {isLoading
            ? "Loading user details..."
            : isError
            ? "Failed to load user details."
            : "User not found."}
        </p>
      </ShowView>
    );
  }

  return (
    <ShowView>
      <ShowViewHeader canEdit={false} />

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          {user.image && (
            <img
              src={user.image}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge>{user.role}</Badge>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Email
            </p>
            <p className="text-sm">{user.email}</p>
          </div>

          {user.createdAt && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Joined
              </p>
              <p className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default UserShowPage;
