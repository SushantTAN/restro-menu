import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      className="toaster"
      richColors
      toastOptions={{
        classNames: {
          // default
          toast:
            "bg-background text-foreground border border-border shadow-lg rounded-md",

          description: "text-muted-foreground",

          actionButton:
            "bg-primary text-primary-foreground hover:opacity-90 transition",

          cancelButton:
            "bg-muted text-muted-foreground hover:opacity-90 transition",

          // variants
          success: "bg-green-500 text-white border-green-600",
          error: "bg-red-500 text-white border-red-600",
          warning: "bg-yellow-400 text-black border-yellow-500",
          info: "bg-blue-500 text-white border-blue-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
