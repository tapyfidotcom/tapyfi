"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productCategories, productSortOptions } from "@/constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Filters() {
  const [searchText, setSearchText] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");
  const router = useRouter();

  const onApply = () => {
    router.push(
      `/user/shop?category=${category}&searchText=${searchText}&sortBy=${sortBy}`
    );
  };

  const onReset = () => {
    setSearchText("");
    setCategory("");
    setSortBy("");
    router.push(`/user/shop`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
      <div>
        <Label>Search</Label>
        <Input
          placeholder="Search products"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div>
        <Label>Category</Label>
        <Select
          onValueChange={(value) => setCategory(value)}
          defaultValue={category}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

          <SelectContent>
            {productCategories.map((category) => (
              <SelectItem value={category.value} key={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Sort By</Label>
        <Select
          onValueChange={(value) => setSortBy(value)}
          defaultValue={sortBy}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

          <SelectContent>
            {productSortOptions.map((option) => (
              <SelectItem value={option.value} key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Button variant={"outline"} onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onApply}>Apply</Button>
      </div>
    </div>
  );
}

export default Filters;
