import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";

import { User, UserRole } from "@/types";

const ROLE_FILTER_OPTIONS = [
  { value: UserRole.ADMIN, label: "Admin" },
  { value: UserRole.TEACHER, label: "Teacher" },
  { value: UserRole.STUDENT, label: "Student" },
];

const roleBadgeVariant = (role: UserRole) => {
  if (role === UserRole.ADMIN) return "default";
  if (role === UserRole.TEACHER) return "secondary";
  return "outline";
};

const UserListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const userColumns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title ml-2">Name</p>,
        cell: ({ getValue }) => (
          <span className="ml-2 text-foreground">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "email",
        accessorKey: "email",
        size: 260,
        header: () => <p className="column-title">Email</p>,
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "role",
        accessorKey: "role",
        size: 140,
        header: () => <p className="column-title">Role</p>,
        cell: ({ getValue }) => {
          const role = getValue<UserRole>();

          return <Badge variant={roleBadgeVariant(role)}>{role}</Badge>;
        },
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="users"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
    ],
    []
  );

  const roleFilters =
    selectedRole === "all"
      ? []
      : [
          {
            field: "role",
            operator: "eq" as const,
            value: selectedRole,
          },
        ];

  const searchFilters = searchQuery
    ? [
        {
          field: "search",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const userTable = useTable<User>({
    columns: userColumns,
    refineCoreProps: {
      resource: "users",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        // Compose refine filters from the current UI selections.
        permanent: [...roleFilters, ...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Faculty & Users</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ROLE_FILTER_OPTIONS.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DataTable table={userTable} />
    </ListView>
  );
};

export default UserListPage;
