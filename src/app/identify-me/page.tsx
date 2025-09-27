"use client";

import React, { useState } from "react";
import { Button, Input, Label } from "@/components/ui";
import { useRouter } from "next/navigation";

const IdentifyMe = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fetchRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    // const data = await fetchRes.json();

    if (fetchRes.ok) {
      router.push("/notelogs/add");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        action=""
        className="flex flex-col gap-4 p-8 border rounded-lg bg-background"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder="Enter your email"
            name="email"
            onChange={handleChange}
            id="email"
            value={formData.email}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            placeholder="Enter your password"
            type="password"
            name="password"
            onChange={handleChange}
            id="password"
            value={formData.password}
          />
        </div>
        <Button type="submit" className="w-full mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default IdentifyMe;
