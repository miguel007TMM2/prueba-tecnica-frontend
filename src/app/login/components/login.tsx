"use client";

import { JSX, useState } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api";
interface Form extends Record<string, unknown> {
  email: string;
  password: string;
}

export function LoginComponent(): JSX.Element {
  const [formData, setFormData] = useState<Form>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  function HandleInputForm(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(): Promise<void> {
    setLoading(true);
    try {
      const data: {
        token?: string;
        expiresIn?: number | Date;
        message?: string;
      } = await apiRequest({
        method: "POST",
        endpoint: "/login",
        body: formData,
      });
      if (data.token) {
        setCookie("token", data);
        router.push("/");
      } else {
        alert(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex align-middle min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Login in to your account
        </h2>
      </div>
      <form
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
        onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="space-y-4">
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Email address
          </label>
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

        <div className="flex items-center justify-between mt-2">
          <label
            htmlFor="password"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Password
          </label>
        </div>
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
        <button
          type="submit"
          className="flex mt-5 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
         {loading ? "Loading..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
