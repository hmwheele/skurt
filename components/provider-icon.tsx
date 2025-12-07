import { cn } from "@/lib/utils"

interface ProviderIconProps {
  provider: string
  className?: string
}

export function ProviderIcon({ provider, className }: ProviderIconProps) {
  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "viator":
        return "bg-blue-600"
      case "getyourguide":
        return "bg-red-600"
      case "klook":
        return "bg-orange-600"
      case "kkday":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white text-xs font-bold",
        getProviderColor(provider),
        className
      )}
    >
      {provider.charAt(0).toUpperCase()}
    </div>
  )
}
