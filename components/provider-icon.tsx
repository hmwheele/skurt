import { cn } from "@/lib/utils"

interface ProviderIconProps {
  provider: string
  className?: string
}

export function ProviderIcon({ provider, className }: ProviderIconProps) {
  const getProviderUrl = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "viator":
        return "viator.com"
      case "getyourguide":
        return "getyourguide.com"
      case "klook":
        return "klook.com"
      case "kkday":
        return "kkday.com"
      default:
        return null
    }
  }

  const providerUrl = getProviderUrl(provider)

  if (providerUrl) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${providerUrl}&sz=64`}
        alt={`${provider} icon`}
        className={cn("rounded-sm", className)}
      />
    )
  }

  // Fallback for unknown providers
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white text-xs font-bold bg-gray-600",
        className
      )}
    >
      {provider.charAt(0).toUpperCase()}
    </div>
  )
}
