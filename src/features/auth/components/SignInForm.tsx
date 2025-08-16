import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChromeIcon, GithubIcon } from "lucide-react";

async function signInWithGoogle() {
  "use server";
  await signIn("google");
}

async function signInWithGithub() {
  "use server";
  await signIn("github");
}

export const SignInForm = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign In
        </CardTitle>

        <CardDescription className="text-center">
          Choose Your Preferred Sign-in Method
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <form action={signInWithGoogle}>
          <Button className="w-full" variant={"outline"} type="submit">
            <ChromeIcon className="mr-2 h-4 w-4" />
            <span>Sign in with google</span>
          </Button>
        </form>

        <form action={signInWithGithub}>
          <Button className="w-full" variant={"outline"} type="submit">
            <GithubIcon className="mr-2 h-4 w-4" />
            <span>Sign in with Github</span>
          </Button>
        </form>
      </CardContent>

    </Card>
  );
};
