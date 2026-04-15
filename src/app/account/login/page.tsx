"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Header, Footer } from "@/components/layout";
import { Container, Section, Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  // Only redirect after auth check is complete and user is authenticated
  useEffect(() => {
    if (!isLoading && !checkedAuth) {
      setCheckedAuth(true);
      if (isAuthenticated) {
        router.push("/account");
      }
    }
  }, [isLoading, isAuthenticated, checkedAuth, router]);

  // Don't render form while checking auth
  if (!checkedAuth || isLoading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen">
          <Section background="white" padding="lg">
            <Container>
              <div className="flex items-center justify-center py-20">
                <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </Container>
          </Section>
        </main>
        <Footer />
      </>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/account");
    } else {
      setError(result.message || "Login failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <Section background="cream" padding="sm">
          <Container>
            <h1 className="font-heading text-3xl md:text-4xl text-text-primary">
              Welcome Back
            </h1>
            <p className="text-text-light mt-2">
              Sign in to access your account and track your orders
            </p>
          </Container>
        </Section>

        <Section background="white" padding="lg">
          <Container>
            <div className="max-w-md mx-auto">
              <div className="bg-background rounded-premium p-6 md:p-8 border border-neutral-light">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-premium text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-text-light mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-3 border border-neutral-light rounded-premium text-text-primary placeholder:text-neutral-taupe focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-text-light mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full px-4 py-3 border border-neutral-light rounded-premium text-text-primary placeholder:text-neutral-taupe focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="w-5 h-5 animate-spin mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-text-light">
                    Don't have an account?{" "}
                    <Link
                      href="/account/register"
                      className="text-primary hover:text-primary-700 font-medium transition-colors"
                    >
                      Create one
                    </Link>
                  </p>
                </div>


              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}