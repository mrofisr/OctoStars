import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GitRepoStars from "@/lib/github";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { IoStarSharp } from "react-icons/io5";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const Stars = () => {
  const slug = useParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(
    new URLSearchParams(useLocation().search).get("page") || 1,
  );
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ next: null, last: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchRepos = async () => {
      if (!slug.username) return;
      setLoading(true);
      setError(null);

      try {
        const { data, pagination } = await GitRepoStars(slug.username, page);
        setRepos(data);
        setPagination(pagination);
      } catch (error) {
        setError("Failed to fetch repos");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [slug.username, page]);
  useEffect(() => {
    document.title = "OctoStars - The Github Stars Finder";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Search for a Github user to see their starred repositories",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Search for a Github user to see their starred repositories";
      document.head.appendChild(meta);
    }
  }, []);

  const handleNextPage = () => {
    if (pagination.next && page < pagination.last) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const totalPages = pagination.last ? Number(pagination.last) : 1;
  const startPage = Math.max(page - 2, 1);
  const endPage = Math.min(startPage + 4, totalPages);
  return (
    <>
      <div className="container mx-auto items-center justify-center py-8">
        <h1 className="text-3xl font-bold text-black font-mono text-center">
          {slug.username} <span className="text-amber-500">Stars</span>
        </h1>
        <div className="grid grid-cols-3 py-4 space-x-2">
          <Input id="search" type="text" placeholder="Search Repo" />
          <div className="flex">
            <input
              type="button"
              value="Search"
              onClick={() => setSearch(document.getElementById("search").value)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 rounded w-1/4 border-2 border-black"
            />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? frameworks.find((framework) => framework.value === value)
                        ?.label
                    : "Select Language..."}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search Language..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue,
                            );
                            setOpen(false);
                          }}
                        >
                          {framework.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              value === framework.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {/* Skeleton */}
          {loading
            ? Array.from({ length: 30 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center space-x-2 animate-pulse w-full">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 animate-pulse w-full">
                      <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
                    </div>
                  </CardContent>
                  <CardContent>
                    <div className="flex items-center space-x-2 animate-pulse w-full">
                      <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center space-x-2 animate-pulse w-full">
                      <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            : repos.map((item) => (
                <>
                  <Card className="cursor-pointer w-full hover:shadow-lg">
                    <a
                      href={"https://github.com/" + item.full_name}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg capitalize">
                          {item.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{item.description}</CardDescription>
                      </CardContent>
                      <CardContent className="flex flex-wrap space-x-2 flex-col sm:flex-row">
                        {item.topics.slice(0, 4).map((topic) => (
                          <a
                            key={topic}
                            href={"?topic=" + topic}
                            className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                          >
                            {topic}
                          </a>
                        ))}
                      </CardContent>
                      <CardFooter>
                        <IoStarSharp className="text-yellow-400" size={20} />
                        <CardDescription>
                          {item.stargazers_count}
                        </CardDescription>
                      </CardFooter>
                    </a>
                  </Card>
                </>
              ))}
        </div>
      </div>
      <div className="flex justify-center w-full pb-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${page - 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  handlePreviousPage();
                }}
                disabled={page === 1}
              >
                Previous
              </PaginationPrevious>
            </PaginationItem>
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i,
            ).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={`?page=${pageNum}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(pageNum);
                  }}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            {endPage < totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href={`?page=${page + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNextPage();
                }}
                disabled={page === totalPages}
              >
                Next
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Stars;
