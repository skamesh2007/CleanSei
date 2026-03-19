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
import { Leaf } from "lucide-react";

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
        <Card className="shadow-lg border border-gray-100 dark:border-border rounded-2xl">
  
            <CardHeader className="space-y-4 text-center pb-2">

              {/* Brand */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                  <Leaf size={16} className="text-emerald-500" />
                </div>
                <span className="text-sm font-semibold tracking-wide text-emerald-500">
                  CleanSei
                </span>
              </div>

              {/* Title */}
              <CardTitle className="text-2xl font-bold">
                Welcome back
              </CardTitle>

              {/* Subtitle */}
              <CardDescription className="text-sm text-muted-foreground">
                Sign in to continue to your dashboard
              </CardDescription>

            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit}>
                <FieldGroup className="space-y-4">

                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-10"
                    />
                  </Field>

                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}

                  <Field className="space-y-3">

                    <Button
                      type="submit"
                      className="w-full h-10 font-semibold"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>

                    <FieldDescription className="text-center text-sm text-muted-foreground">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/auth/register"
                        className="font-medium text-emerald-500 hover:underline"
                      >
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