import { Spinner } from "@material-tailwind/react";
 
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-96">
      <Spinner color="green" className="h-16 w-16 text-gray-900/50" />
    </div>
  )
}