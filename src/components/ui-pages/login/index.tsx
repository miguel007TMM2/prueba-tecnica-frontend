"use client";

import { JSX, useState } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api";
import { FormHeader } from "@/components/global-component/formHeader";
import { FormInput } from "@/components/global-component/formInput";
import { SubmitButton } from "@/components/global-component/submitButton";
import { RegisterLink } from "@/components/global-component/formRedirectLink";
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
      <FormHeader title="Login in to your account" />
      <form
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
        onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FormInput
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={HandleInputForm}
          label="Email address"
          autoComplete="email"
          required
        />
        <FormInput
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={HandleInputForm}
          label="Password"
          autoComplete="current-password"
          required
        />
        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>
      <RegisterLink message="Don't have an account?" titleRedirectLink="Sign up" redirectPath="/register"/>
    </div>
  );
}
