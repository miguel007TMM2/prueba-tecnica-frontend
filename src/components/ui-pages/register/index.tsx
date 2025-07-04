"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api";
import { SubmitButton } from "@/components/global-component/submitButton";
import { FormInput } from "@/components/global-component/formInput";
import { FormHeader } from "@/components/global-component/formHeader";
import { RegisterLink } from "@/components/global-component/formRedirectLink";

interface Form extends Record<string, unknown> {
  username: string;
  email: string;
  password: string;
}

export function RegisterComponent(): JSX.Element {
  const [formData, setFormData] = useState<Form>({
    email: "",
    password: "",
    username: "",
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
      const data: { message: string } = await apiRequest({
        method: "POST",
        endpoint: "/register",
        body: formData,
      });
      alert(data.message);
      router.push("/login");
      console.log(data.message);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex align-middle min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <FormHeader title="Create a new account" />
      <form
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
        onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FormInput
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={HandleInputForm}
          label="Username"
          required
        />
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

        <SubmitButton loading={loading}>Sign up</SubmitButton>
      </form>
      <RegisterLink message="Already have an account?" titleRedirectLink="Sign in" redirectPath="/login"/>
    </div>
  );
}
