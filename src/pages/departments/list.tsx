import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

import { Department } from "@/types";

const DepartmentListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const departmentColumns = useMemo<ColumnDef<Department>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        size: 100,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: "name",
        accessorKey: "name",
        size: 220,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "description",
        accessorKey: "description",
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => (
          <span className="truncate line-clamp-2">{getValue<string>()}</span>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="departments"
            recordItemId={row.original.id}
            variant="outline"
            size="sm"
          >
            View
          </ShowButton>
        ),
      },
      {
        id: "actions",
        size: 140,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <DeleteButton
            resource="departments"
            recordItemId={row.original.id}
            size="sm"
          />
        ),
      },
    ],
    []
  );

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const departmentTable = useTable<Department>({
    columns: departmentColumns,
    refineCoreProps: {
      resource: "departments",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        // Compose refine filters from the current UI selections.
        permanent: [...searchFilters],
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
      <h1 className="page-title">Departments</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <CreateButton resource="departments" />
          </div>
        </div>
      </div>

      <DataTable table={departmentTable} />
    </ListView>
  );
};

export default DepartmentListPage;
