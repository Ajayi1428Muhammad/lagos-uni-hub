import { signIn } from "@/auth";

const  SignInPage = async ({searchParams}) => {
  const params = await searchParams
  const targetRedirect = params.callbackUrl || "/"
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md text-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500">Sign in to manage your account</p>

          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: targetRedirect,
                authorization: { params: { prompt: "select_account" } },
              });
            }}
          >
            <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold  shadow-sm transition">
              Continue with Google
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
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}


export default SignInPage;