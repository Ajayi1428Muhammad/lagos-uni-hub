import { signIn } from "@/auth";

const  SignUpPage = async ({searchParams}) => {
  const params = await searchParams
  const targetRedirect = params.callbackUrl || "/"
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md text-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500">Join the pulse</p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: targetRedirect });
            }}
          >
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg bg-white px-4 py-3 font-semibold  shadow-sm  transition">
              Sign Up with Google
            </button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("github", {
                redirectTo: targetRedirect,
              });
            }}
          >
            <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition">
              Continue with GitHub
            </button>
          </form>
        </div>
        <p className="text-xs text-gray-500">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;