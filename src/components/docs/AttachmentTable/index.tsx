"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Download, ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import { Attachment, getIconFromFileType } from "@/lib/utils";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { handleDownload } from "@/lib/utils";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddAttachmentDropdown from "../CreateAttachment";

export default function AttachmentTable({ all, refetch }: { all: Attachment[], refetch: () => void }) {
  const [filter, setFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [tagFilter, setTagFilter] = React.useState<string | null>(null);
  const uniqueTags = Array.from(new Set(all.flatMap(att => att.tags)));

  const filteredAttachments = React.useMemo(() => {
    return all.filter((att) => {
      const nameMatch = att.fileName.toLowerCase().includes(filter.toLowerCase());
      const tagMatch = tagFilter ? att.tags?.includes(tagFilter) : true;
      return nameMatch && tagMatch;
    });
  }, [all, filter, tagFilter]);
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredAttachments.map((att) => ({
        FileName: att.fileName,
        FileType: att.fileType,
        UploadedBy: att.uploadedBy.username,
        Tags: att.tags?.join(", "),
        UploadedAt: format(new Date(att.uploadedAt), "dd MMM yyyy, hh:mm a"),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attachments");
    XLSX.writeFile(wb, "attachments.xlsx");
  };

  const columns: ColumnDef<Attachment>[] = [
    {
      accessorKey: "fileType",
      header: "Type",
      cell: ({ row }) => {
        const icon = getIconFromFileType(row.original.fileType).image;
        console.log(row.original.fileType, icon)
        const UploadedAt = format(new Date(row.original.uploadedAt), "dd MMM yyyy")
        return (
          <div className="flex max-w-full overflow-x-auto gap-3 items-center">
            <img src={icon} alt="icon" className="w-8 h-8" />
            <div className="max-w-full">
              <h2 className="line-clamp-1 font-semibold text-[1.09rem] capitalize">{row.original.fileName}</h2>
              <p className="text-xs w-full line-clamp-1 text-gray-600 dark:text-gray-200">uploaded by {row.original.uploadedBy.username} on {UploadedAt}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "fileName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File Name <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.fileName}</span>,
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-60 overflow-x-auto">
          {row.original.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-blue-200 text-blue-800">
              {tag}
            </Badge>
          ))}
          {
            (row.original.tags?.length === 0 || !row.original.tags) && (
              <Badge variant="outline" className="text-xs bg-rose-100 text-rose-600">
                No tags
              </Badge>
            )
          }
        </div>
      ),
    },
    {
      accessorKey: "Att_group",
      header: "Shared With",
      cell: ({ row }) => {
        const group = row.original.Att_group;
        return group ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="px-2 py-1 text-sm hover:bg-accent">
                <div className="flex items-center -space-x-2">
                  {
                    group.sampleMembers.map((item, index) => {
                      return (
                        <div key={index}>
                          <Avatar>
                            <AvatarImage className="size-8 border border-accent-foreground rounded-full" src={"/meeting4.jpg"}></AvatarImage>
                          </Avatar>
                        </div>
                      )
                    })
                  }
                  
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-84 shadow-md border bg-popover text-popover-foreground">
              <p className="font-semibold mb-2 text-sm">{group.name}</p>
              <div className="space-y-1">
                {group.sampleMembers.map((m) => (
                  <div key={m._id} className="flex bg-accent rounded-2xl p-2 items-center gap-2 text-sm">
                      <img src={m.profileImageUrl || "/meeting4.jpg"} alt={m.username} className="size-8 rounded-full" />
                    <span>{m.username}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <span className="italic text-muted-foreground">No Group</span>
        );
      },
    },
    {
      accessorKey: "uploadedAt",
      header: "Uploaded",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.uploadedAt), "dd MMM yyyy, hh:mm a")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const attachment = row.original
        return (
          <button
            onClick={() => handleDownload({ fileUrl: attachment.fileUrl, fileName: attachment.fileName, fileType: attachment.fileType })}
            className="flex items-center rounded-full bg-teal-200 cursor-pointer text-teal-800 text-sm p-2 hover:scale-105 border-2 border-teal-500 "
          >
            <Download className="w-4 h-4 mr-1" /> Download
          </button>
        )
      },
    },
  ];

  const table = useReactTable({
    data: filteredAttachments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full text-foreground px-2 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-4 mb-3">
        <Input
          placeholder="Search by file name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2 items-center flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer " asChild>
              <Button variant="outline" className="">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(e) => e.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <AddAttachmentDropdown refetch={refetch} />

          <Button onClick={exportToExcel} variant="outline">
            Export to Excel
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pb-4 ">
        <Badge
          className={`cursor-pointer ${tagFilter === null ? "bg-accent text-accent-foreground" : "bg-accent-foreground text-accent"}`}
          onClick={() => setTagFilter(null)}
        >
          All
        </Badge>
        {uniqueTags?.map((tag) => {
          if (tag?.length)return (
            <Badge
              key={tag}
              className={`cursor-pointer ${tagFilter === tag ? "bg-accent text-accent-foreground" : "bg-accent-foreground text-accent"}`}
              onClick={() => setTagFilter(tag || null)}
            >
              {tag}
            </Badge>
          )
        })}

      </div>

      <div className="rounded-md border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-white dark:hover:bg-black">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-sm"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-accent/40 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-sm ml-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}