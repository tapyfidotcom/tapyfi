"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SignUp, SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

function Homepage() {
  const [openSignInForm, setOpenSignInForm] = React.useState(false);
  const searchParams = useSearchParams();
  const formType = searchParams.get("formType");
  const menuItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  return (
    <div className="lg:px-20 px-5 py-5">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-primary">
          <b>S . O . F</b>
        </h1>

        <div className="flex gap-5 items-center">
          {menuItems.map((item, index) => (
            <div key={index} className="text-sm text-gray-600 font-bold">
              {item.name}
            </div>
          ))}

          <Button onClick={() => setOpenSignInForm(true)}>SignIn</Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[80vh] items-center">
        <div className="col-span-1">
          <div>
            <h1 className=" text-2xl lg:text-4xl font-bold text-primary">
              SHEY - <b className="text-orange-600">ORGANIC</b> - FOODS
            </h1>
            <p className="text-gray-600 text-sm font-semibold">
              Shey-Organic-Foods is a platform that connects farmers to buyers
              and provides a platform for farmers to sell their produce directly
              to consumers. Here you can find fresh farm produce at affordable
              prices.
            </p>
          </div>
        </div>
        <div className="col-span-1 flex justify-center lg:justify-end">
          <img
            src="https://next-supa-agri-marketplace.vercel.app/hero.jpg"
            className="w-auto h-80 object-contain"
          />
        </div>
      </div>

      <Sheet open={openSignInForm} onOpenChange={setOpenSignInForm}>
        <SheetContent className="min-w-[500px] flex justify-center items-center">
          <SheetHeader>
            <SheetTitle></SheetTitle>
          </SheetHeader>

          <div>
            {formType === "signup" ? (
              <SignUp routing="hash" signInUrl="/?formType=signin" />
            ) : (
              <SignIn routing="hash" signUpUrl="/?formType=signup" />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Homepage;
