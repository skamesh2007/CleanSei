"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { auth } from "@/lib/firebase"

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth"

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

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // ✅ validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      // ✅ create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      // ✅ store name
      await updateProfile(user, {
        displayName: name,
      })

      // ✅ email verification
      await sendEmailVerification(user)

      // ✅ redirect
      router.push("/auth/login")

    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use")
      } else if (err.code === "auth/weak-password") {
        setError("Weak password")
      } else {
        setError("Registration failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="shadow-lg border border-gray-100 dark:border-border rounded-2xl">

            <CardHeader className="space-y-4 text-center pb-2">

              {/* Brand */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                  <span className="text-emerald-500 text-lg font-bold">♻️</span>
                </div>
                <span className="text-sm font-semibold tracking-wide text-emerald-500">
                  CleanSei
                </span>
              </div>

              {/* Title */}
              <CardTitle className="text-2xl font-bold">
                Create your account
              </CardTitle>

              {/* Subtitle */}
              <CardDescription className="text-sm text-muted-foreground">
                Start reporting and making an impact
              </CardDescription>

            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit}>
                <FieldGroup className="space-y-4">

                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-10"
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10"
                    />
                    <FieldDescription>
                      We won’t share your email.
                    </FieldDescription>
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

                  <Field>
                    <FieldLabel>Confirm Password</FieldLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>

                    {/* Disabled Google button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-10"
                      disabled
                    >
                      Continue with Google
                    </Button>

                    <FieldDescription className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        href="/auth/login"
                        className="font-medium text-emerald-500 hover:underline"
                      >
                        Sign in
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