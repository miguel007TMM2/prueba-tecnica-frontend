'use client';
import Tiptap from "./RteEditor";
import { deleteCookie } from 'cookies-next'

export default function Home() {
  function handleLogout() {
    deleteCookie("token");
  }

  return (
    <div className="flex flex-col w-1/2 mx-auto mt-10">
      <button
        onClick={() => handleLogout()}
        className="self-end mb-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Log out
      </button>
      <Tiptap />
    </div>
  );
}
