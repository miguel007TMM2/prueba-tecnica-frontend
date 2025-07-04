export function FormHeader({ title }: { title: string }) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        {title}
      </h2>
    </div>
  );
}
