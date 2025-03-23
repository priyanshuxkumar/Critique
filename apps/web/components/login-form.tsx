import axios, { AxiosError } from "axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import GoogleIcon from "./icons/GoogleIcon"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [email , setEmail] = useState<string>();
  const [password , setPassword] = useState<string>();

  const handleForm = async(e : React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmiting(true)
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/auth/signin`, {
        email , 
        password
      }, {
        withCredentials: true
      }
      );
      if(response.status == 200){
        toast(response.data.message || "Signin successful!");
        router.push('/dashboard');
      }
    } catch (error : unknown) {
      if(error instanceof AxiosError){
        toast(error?.response?.data.message || "Invalid credentials");
      }else {
        toast('Something went wrong!');
      }
    }finally{
      setIsSubmiting(false);
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forget-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input onChange={(e) => setPassword(e.target.value)} id="password" type="password" placeholder="********" required />
        </div>
        <Button onClick={ handleForm } type="submit" className="w-full" disabled={isSubmiting || Number(password?.length) < 8}>
          {isSubmiting ? 'Please wait': 'Login'}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full" disabled>
          <GoogleIcon/>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  )
}
