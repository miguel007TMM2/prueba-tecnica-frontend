import Link from "next/link";
import { JSX } from "react";

export function RegisterLink({message, titleRedirectLink, redirectPath} : {message: string, titleRedirectLink: string, redirectPath: string}): JSX.Element {
  return (
    <div className="mt-5 text-center">
      <p className="text-sm text-gray-600">
        {message}{" "}
        <Link href={redirectPath} className="font-semibold text-indigo-600">
          {titleRedirectLink} 
        </Link>
      </p>
    </div>
  );
}
