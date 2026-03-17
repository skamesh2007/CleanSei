"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)

      // ✅ Login with Firebase
      await signInWithEmailAndPassword(auth, email, password)

      // ✅ Redirect after login
      router.push("/")

    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("User not found")
      } else if (err.code === "auth/wrong-password") {
        setError("Wrong password")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email")
      } else {
        setError("Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="underline">
                      Sign up
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}