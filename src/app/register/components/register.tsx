"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Form {
  username?: string;
  email: string;
  password: string;
}

enum method {
  GET = "GET",
  POST = "POST",
  PUTH = "PUTH",
  DELETE = "DELETE",
}

enum contentType {
  ApplicationJson = "application/json",
}

interface Options {
  method: method;
  headers: {
    "Content-Type": contentType;
  };
  body: string;
}

export function RegisterComponent() {
  const [formData, setFormData] = useState<Form>({
    email: "",
    password: "",
    username: "",
  });

  const router = useRouter();

  function HandleInputForm(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit() {
    const options: Options = {
      method: method.POST,
      headers: {
        "Content-Type": contentType.ApplicationJson,
      },
      body: JSON.stringify(formData),
    };

    fetch("https://ucw4k4kk0coss4k08k0ow4ko.softver.cc/api/register", options)
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        router.push("/login");
        console.log(data.message);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex align-middle min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>
      <form
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
         <div className="space-y-6">
          <label
            htmlFor="username"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Username
          </label>
          <div className="mt-2">
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={HandleInputForm}
              required
              autoComplete="username"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div className="space-y-6">
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={HandleInputForm}
              required
              autoComplete="email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Password
          </label>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={HandleInputForm}
            required
            autoComplete="current-password"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
        <button
          type="submit"
          className="flex mt-5 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
