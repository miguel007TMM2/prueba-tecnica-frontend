'use client';
import { JSX } from "react";
import Tiptap from "../components/ui-pages/text-editor";
import { deleteCookie } from 'cookies-next'

export default function Home(): JSX.Element {

  function handleLogout(): void {
    deleteCookie("token");
    window.location.href = "/login"; 
  }

  return (
    <div className="flex flex-col w-1/2 mx-auto mt-10">
      <button
        onClick={() => handleLogout()}
        className="self-end mb-4 px-4 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
      >
        Log out
      </button>
      <Tiptap />
    </div>
  );
}
